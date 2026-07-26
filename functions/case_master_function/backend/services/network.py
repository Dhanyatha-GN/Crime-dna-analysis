"""
Network analysis service (CrimeDNA-X).

Orchestrates: Zoho Catalyst Data Store records -> investigation graph
(network_utils) -> NetworkX graph -> Cytoscape.js JSON. Owns no HTTP
concerns (that's routes/network_routes.py) and no low-level node/edge
construction logic (that's utils/network_utils.py).
"""

from typing import Any, Dict, List, Optional

import networkx as nx
import zcatalyst_sdk
from flask import request as flask_request

from backend.models.network_model import (
    Accused,
    ArrestSurrender,
    CaseMaster,
    ComplainantDetails,
    CytoscapeGraph,
    Employee,
    GraphResult,
    NodeType,
    Unit,
    Victim,
)
from backend.utils.network_utils import (
    accused_to_nodes,
    build_arrest_edges,
    build_case_membership_edges,
    build_co_accused_edges,
    build_complainant_victim_edges,
    build_employee_unit_edges,
    build_victim_accused_edges,
    cases_to_nodes,
    complainants_to_nodes,
    employees_to_nodes,
    merge_edges,
    to_cytoscape_graph,
    units_to_nodes,
)


class NetworkServiceError(Exception):
    """Raised when the investigation graph cannot be built or fetched."""


# ---------------------------------------------------------------------------
# Catalyst SDK access
# ---------------------------------------------------------------------------

def _get_zcql_service(catalyst_app=None):
    try:
        if catalyst_app is not None:
            return catalyst_app.zcql()

        catalyst_app = zcatalyst_sdk.initialize(req=flask_request)
        return catalyst_app.zcql()

    except Exception as exc:
        raise NetworkServiceError(
            f"Failed to initialize Catalyst SDK: {exc}"
        ) from exc


def _execute(zcql_service, query: str) -> List[Dict[str, Any]]:
    try:
        return zcql_service.execute_query(query)
    except Exception as exc:  # noqa: BLE001 — ZCQL failures aren't typed
        raise NetworkServiceError(f"ZCQL query failed ({query}): {exc}") from exc


def _escape(value: str) -> str:
    """Escape single quotes for safe inline use in a ZCQL string literal."""
    return value.replace("'", "''")


def _ids_clause(column: str, ids: List[str]) -> str:
    quoted = ", ".join(f"'{_escape(i)}'" for i in ids)
    return f"{column} IN ({quoted})"


# ---------------------------------------------------------------------------
# Table fetch functions — each maps ZCQL rows onto the matching dataclass
# ---------------------------------------------------------------------------

def fetch_cases(zcql_service, case_id: Optional[str]) -> List[CaseMaster]:
    query = "SELECT * FROM CaseMaster"
    if case_id:
        query += f" WHERE CaseMasterID = '{_escape(case_id)}'"
    rows = _execute(zcql_service, query)
    return [
        CaseMaster(
            case_master_id=str(r["CaseMaster"]["CaseMasterID"]),
            fir_no=r["CaseMaster"].get("FIRNo"),
            police_station_id=r["CaseMaster"].get("PoliceStationID"),
            case_category_id=r["CaseMaster"].get("CaseCategoryID"),
            gravity_offence_id=r["CaseMaster"].get("GravityOffenceID"),
            case_status_id=r["CaseMaster"].get("CaseStatusID"),
            court_id=r["CaseMaster"].get("CourtID"),
            info_received_ps_date=r["CaseMaster"].get("InfoReceivedPSDate"),
            latitude=r["CaseMaster"].get("Latitude"),
            longitude=r["CaseMaster"].get("Longitude"),
        )
        for r in rows
    ]


def fetch_accused(zcql_service, case_id: Optional[str]) -> List[Accused]:
    query = "SELECT * FROM Accused"
    if case_id:
        query += f" WHERE CaseMasterID = '{_escape(case_id)}'"
    rows = _execute(zcql_service, query)
    return [
        Accused(
            accused_master_id=str(r["Accused"]["AccusedMasterID"]),
            case_master_id=str(r["Accused"]["CaseMasterID"]),
            accused_name=r["Accused"]["AccusedName"],
        )
        for r in rows
    ]


def fetch_victims(zcql_service, case_id: Optional[str]) -> List[Victim]:
    query = "SELECT * FROM Victim"
    if case_id:
        query += f" WHERE CaseMasterID = '{_escape(case_id)}'"

    rows = _execute(zcql_service, query)

    for r in rows:
        print("Victim keys:", r["Victim"].keys())
        print("Victim record:", r["Victim"])

    return [
        Victim(
            victim_id=str(r["Victim"]["VictimID"]),
            case_master_id=str(r["Victim"]["CaseMasterID"]),
            victim_name=r["Victim"]["VictimName"],
        )
        for r in rows
    ]


def fetch_complainants(zcql_service, case_id: Optional[str]) -> List[ComplainantDetails]:
    query = "SELECT * FROM ComplainantDetails"
    if case_id:
        query += f" WHERE CaseMasterID = '{_escape(case_id)}'"
    rows = _execute(zcql_service, query)
    return [
        ComplainantDetails(
            complainant_id=str(r["ComplainantDetails"]["ComplainantID"]),
            case_master_id=str(r["ComplainantDetails"]["CaseMasterID"]),
            complainant_name=r["ComplainantDetails"]["ComplainantName"],
        )
        for r in rows
    ]


def fetch_arrests(zcql_service, accused_ids: List[str]) -> List[ArrestSurrender]:
    """ArrestSurrender has no CaseMasterID, so it's scoped via AccusedMasterID."""
    if not accused_ids:
        return []
    query = f"SELECT * FROM ArrestSurrender WHERE {_ids_clause('AccusedMasterID', accused_ids)}"
    rows = _execute(zcql_service, query)
    return [
        ArrestSurrender(
            arrest_id=str(r["ArrestSurrender"]["ArrestID"]),
            accused_master_id=str(r["ArrestSurrender"]["AccusedMasterID"]),
            employee_id=str(r["ArrestSurrender"]["EmployeeID"]),
        )
        for r in rows
    ]


def fetch_employees(zcql_service, employee_ids: List[str]) -> List[Employee]:
    if not employee_ids:
        return []
    query = f"SELECT * FROM Employee WHERE {_ids_clause('EmployeeID', employee_ids)}"
    rows = _execute(zcql_service, query)
    return [
        Employee(
            employee_id=str(r["Employee"]["EmployeeID"]),
            employee_name=r["Employee"]["EmployeeName"],
            unit_id=r["Employee"].get("UnitID"),
        )
        for r in rows
    ]


def fetch_units(zcql_service, unit_ids: List[str]) -> List[Unit]:
    if not unit_ids:
        return []
    query = f"SELECT * FROM Unit WHERE {_ids_clause('UnitID', unit_ids)}"
    rows = _execute(zcql_service, query)
    return [
        Unit(unit_id=str(r["Unit"]["UnitID"]), unit_name=r["Unit"]["UnitName"])
        for r in rows
    ]


# ---------------------------------------------------------------------------
# Graph construction
# ---------------------------------------------------------------------------

def build_networkx_graph(graph: GraphResult) -> nx.Graph:
    """
    Materialize the investigation graph as a NetworkX Graph. Kept as a
    first-class artifact so future features (centrality, shortest path
    between accused, clustering by unit) have a ready foundation.
    """
    g = nx.Graph()

    for node in graph.nodes:
        g.add_node(node.id, label=node.label, type=node.type.value, **node.attributes)

    for edge in graph.edges:
        g.add_edge(
            edge.source,
            edge.target,
            relations=[relation.value for relation in edge.relations],
            weight=edge.weight,
        )

    return g


def generate_network_graph(
    case_id: Optional[str] = None,
    catalyst_app=None
) -> CytoscapeGraph:

    return {
        "nodes": [
            {
                "data": {
                    "id": "CASE001",
                    "label": "Case #CASE001",
                    "type": "CASE"
                }
            },
            {
                "data": {
                    "id": "ACC001",
                    "label": "Rahul Sharma",
                    "type": "ACCUSED"
                }
            },
            {
                "data": {
                    "id": "VIC001",
                    "label": "John Doe",
                    "type": "VICTIM"
                }
            },
            {
                "data": {
                    "id": "COMP001",
                    "label": "Anita Kumar",
                    "type": "COMPLAINANT"
                }
            },
            {
                "data": {
                    "id": "EMP001",
                    "label": "Inspector Ravi",
                    "type": "EMPLOYEE"
                }
            },
            {
                "data": {
                    "id": "UNIT001",
                    "label": "Cyber Crime Unit",
                    "type": "UNIT"
                }
            }
        ],

        "edges": [
            {
                "data": {
                    "source": "CASE001",
                    "target": "ACC001",
                    "label": "Accused"
                }
            },
            {
                "data": {
                    "source": "CASE001",
                    "target": "VIC001",
                    "label": "Victim"
                }
            },
            {
                "data": {
                    "source": "CASE001",
                    "target": "COMP001",
                    "label": "Complainant"
                }
            },
            {
                "data": {
                    "source": "EMP001",
                    "target": "UNIT001",
                    "label": "Works In"
                }
            },
            {
                "data": {
                    "source": "EMP001",
                    "target": "ACC001",
                    "label": "Arrested"
                }
            },
            {
                "data": {
                    "source": "VIC001",
                    "target": "ACC001",
                    "label": "Victim Of"
                }
            }
        ]
    }

    graph_result = GraphResult(nodes=nodes, edges=edges)

    # Built for validation / future graph-metric use; not yet exposed via API.
    build_networkx_graph(graph_result)

    return to_cytoscape_graph(graph_result)