"""
Pure helper functions for the Network Analysis module (CrimeDNA-X).

Builds investigation-graph nodes and edges from Catalyst records, and
formats the result as Cytoscape.js JSON. No I/O, no Catalyst calls, no
Flask — `services/network.py` orchestrates these into the final graph.
"""

from itertools import combinations
from typing import Callable, Dict, Iterable, List, Tuple, TypeVar, Union

from functions.case_master_function.backend.models.network_model import (
    Accused,
    ArrestSurrender,
    CaseMaster,
    ComplainantDetails,
    CytoscapeEdge,
    CytoscapeGraph,
    CytoscapeNode,
    Employee,
    GraphEdge,
    GraphNode,
    GraphResult,
    NodeType,
    RelationType,
    Unit,
    Victim,
)

CaseScoped = Union[Accused, Victim, ComplainantDetails]
T = TypeVar("T")


def node_id(node_type: NodeType, raw_id: str) -> str:
    """Namespaced node ID so IDs from different tables never collide."""
    return f"{node_type.value}_{raw_id}"


# ---------------------------------------------------------------------------
# Node construction (one function per entity type)
# ---------------------------------------------------------------------------

def units_to_nodes(units: List[Unit]) -> List[GraphNode]:
    return [
        GraphNode(id=node_id(NodeType.UNIT, u.unit_id), label=u.unit_name, type=NodeType.UNIT)
        for u in units
    ]


def employees_to_nodes(employees: List[Employee]) -> List[GraphNode]:
    return [
        GraphNode(
            id=node_id(NodeType.EMPLOYEE, e.employee_id),
            label=e.employee_name,
            type=NodeType.EMPLOYEE,
            attributes={"unit_id": e.unit_id} if e.unit_id else {},
        )
        for e in employees
    ]


def cases_to_nodes(cases: List[CaseMaster]) -> List[GraphNode]:
    nodes = []
    for c in cases:
        attributes = {
            "fir_no": c.fir_no,
            "police_station_id": c.police_station_id,
            "case_category_id": c.case_category_id,
            "gravity_offence_id": c.gravity_offence_id,
            "case_status_id": c.case_status_id,
            "court_id": c.court_id,
            "info_received_ps_date": c.info_received_ps_date,
            "latitude": c.latitude,
            "longitude": c.longitude,
        }
        nodes.append(
            GraphNode(
                id=node_id(NodeType.CASE, c.case_master_id),
                label=c.fir_no or c.case_master_id,
                type=NodeType.CASE,
                attributes={k: v for k, v in attributes.items() if v is not None},
            )
        )
    return nodes


def complainants_to_nodes(complainants: List[ComplainantDetails]) -> List[GraphNode]:
    return [
        GraphNode(
            id=node_id(NodeType.COMPLAINANT, c.complainant_id),
            label=c.complainant_name,
            type=NodeType.COMPLAINANT,
        )
        for c in complainants
    ]


def victims_to_nodes(victims: List[Victim]) -> List[GraphNode]:
    return [
        GraphNode(id=node_id(NodeType.VICTIM, v.victim_id), label=v.victim_name, type=NodeType.VICTIM)
        for v in victims
    ]


def accused_to_nodes(accused: List[Accused]) -> List[GraphNode]:
    return [
        GraphNode(
            id=node_id(NodeType.ACCUSED, a.accused_master_id),
            label=a.accused_name,
            type=NodeType.ACCUSED,
        )
        for a in accused
    ]


# ---------------------------------------------------------------------------
# Edge construction
# ---------------------------------------------------------------------------

def build_case_membership_edges(
    entities: Iterable[CaseScoped],
    entity_type: NodeType,
    entity_id_getter: Callable[[CaseScoped], str],
) -> List[GraphEdge]:
    """Entity -> Case edges (Accused/Victim/Complainant belong to a Case)."""
    edges: List[GraphEdge] = []
    for entity in entities:
        if not entity.case_master_id:
            continue
        edges.append(
            GraphEdge(
                source=node_id(entity_type, entity_id_getter(entity)),
                target=node_id(NodeType.CASE, entity.case_master_id),
                relations=[RelationType.BELONGS_TO_CASE],
                weight=1,
            )
        )
    return edges


def build_employee_unit_edges(employees: List[Employee]) -> List[GraphEdge]:
    """Employee -> Unit edges."""
    return [
        GraphEdge(
            source=node_id(NodeType.EMPLOYEE, e.employee_id),
            target=node_id(NodeType.UNIT, e.unit_id),
            relations=[RelationType.EMPLOYEE_OF_UNIT],
            weight=1,
        )
        for e in employees
        if e.unit_id
    ]


def build_arrest_edges(arrests: List[ArrestSurrender]) -> List[GraphEdge]:
    """Employee -> Accused edges, derived from ArrestSurrender records."""
    return [
        GraphEdge(
            source=node_id(NodeType.EMPLOYEE, ar.employee_id),
            target=node_id(NodeType.ACCUSED, ar.accused_master_id),
            relations=[RelationType.ARRESTED],
            weight=1,
        )
        for ar in arrests
        if ar.employee_id and ar.accused_master_id
    ]


def _group_ids_by_case(entities: Iterable[T], id_getter: Callable[[T], str]) -> Dict[str, List[str]]:
    groups: Dict[str, List[str]] = {}
    for entity in entities:
        case_master_id = getattr(entity, "case_master_id", None)
        if not case_master_id:
            continue
        groups.setdefault(case_master_id, []).append(id_getter(entity))
    return groups


def build_co_accused_edges(accused: List[Accused]) -> List[GraphEdge]:
    """Accused <-> Accused edges for accused sharing the same CaseMasterID."""
    groups = _group_ids_by_case(accused, lambda a: a.accused_master_id)
    edges: List[GraphEdge] = []
    for ids in groups.values():
        unique_ids = sorted(set(ids))
        for a_id, b_id in combinations(unique_ids, 2):
            edges.append(
                GraphEdge(
                    source=node_id(NodeType.ACCUSED, a_id),
                    target=node_id(NodeType.ACCUSED, b_id),
                    relations=[RelationType.CO_ACCUSED],
                    weight=1,
                )
            )
    return edges


def build_victim_accused_edges(victims: List[Victim], accused: List[Accused]) -> List[GraphEdge]:
    """Victim <-> Accused edges for victims and accused sharing the same CaseMasterID."""
    victim_groups = _group_ids_by_case(victims, lambda v: v.victim_id)
    accused_groups = _group_ids_by_case(accused, lambda a: a.accused_master_id)
    edges: List[GraphEdge] = []
    for case_master_id, victim_ids in victim_groups.items():
        for accused_id in accused_groups.get(case_master_id, []):
            for victim_id in victim_ids:
                edges.append(
                    GraphEdge(
                        source=node_id(NodeType.VICTIM, victim_id),
                        target=node_id(NodeType.ACCUSED, accused_id),
                        relations=[RelationType.VICTIM_ACCUSED],
                        weight=1,
                    )
                )
    return edges


def build_complainant_victim_edges(
    complainants: List[ComplainantDetails], victims: List[Victim]
) -> List[GraphEdge]:
    """Complainant <-> Victim edges for complainants and victims sharing the same CaseMasterID."""
    complainant_groups = _group_ids_by_case(complainants, lambda c: c.complainant_id)
    victim_groups = _group_ids_by_case(victims, lambda v: v.victim_id)
    edges: List[GraphEdge] = []
    for case_master_id, complainant_ids in complainant_groups.items():
        for victim_id in victim_groups.get(case_master_id, []):
            for complainant_id in complainant_ids:
                edges.append(
                    GraphEdge(
                        source=node_id(NodeType.COMPLAINANT, complainant_id),
                        target=node_id(NodeType.VICTIM, victim_id),
                        relations=[RelationType.COMPLAINANT_VICTIM],
                        weight=1,
                    )
                )
    return edges


def merge_edges(edge_lists: List[List[GraphEdge]]) -> List[GraphEdge]:
    """
    Combine edges across relation types. Two nodes linked through more than
    one relation collapse into a single edge, with `relations` accumulating
    every matched relation type and `weight` = number of relations.
    """
    merged: Dict[Tuple[str, str], List[RelationType]] = {}

    for edges in edge_lists:
        for edge in edges:
            key = (edge.source, edge.target)
            relations = merged.setdefault(key, [])
            for relation in edge.relations:
                if relation not in relations:
                    relations.append(relation)

    return [
        GraphEdge(source=source, target=target, relations=relations, weight=len(relations))
        for (source, target), relations in merged.items()
    ]


def to_cytoscape_graph(graph: GraphResult) -> CytoscapeGraph:
    """Convert the internal GraphResult into Cytoscape.js-compatible JSON."""
    nodes: List[CytoscapeNode] = [
        {
            "data": {
                "id": node.id,
                "label": node.label,
                "type": node.type.value,
                "attributes": node.attributes,
            }
        }
        for node in graph.nodes
    ]

    edges: List[CytoscapeEdge] = [
        {
            "data": {
                "id": f"{edge.source}__{edge.target}",
                "source": edge.source,
                "target": edge.target,
                "relations": [relation.value for relation in edge.relations],
                "weight": edge.weight,
            }
        }
        for edge in graph.edges
    ]

    return {"nodes": nodes, "edges": edges}