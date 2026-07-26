"""
Data models for the Network Analysis module (CrimeDNA-X).

Mirrors the actual Zoho Catalyst Data Store schema exactly:
Unit, Employee, CaseMaster, ComplainantDetails, Victim, Accused,
ArrestSurrender. No fields are invented beyond these tables' columns.

Also defines the generic investigation-graph representation (nodes/edges)
and the Cytoscape.js-compatible output format returned by the API.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, TypedDict


# ---------------------------------------------------------------------------
# Raw Catalyst table records — field names map 1:1 to Data Store columns
# ---------------------------------------------------------------------------

@dataclass
class Unit:
    unit_id: str
    unit_name: str


@dataclass
class Employee:
    employee_id: str
    employee_name: str
    unit_id: Optional[str] = None


@dataclass
class CaseMaster:
    case_master_id: str
    fir_no: Optional[str] = None
    police_station_id: Optional[str] = None
    case_category_id: Optional[str] = None
    gravity_offence_id: Optional[str] = None
    case_status_id: Optional[str] = None
    court_id: Optional[str] = None
    info_received_ps_date: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@dataclass
class ComplainantDetails:
    complainant_id: str
    case_master_id: str
    complainant_name: str


@dataclass
class Victim:
    victim_id: str
    case_master_id: str
    victim_name: str


@dataclass
class Accused:
    accused_master_id: str
    case_master_id: str
    accused_name: str


@dataclass
class ArrestSurrender:
    arrest_id: str
    accused_master_id: str
    employee_id: str


# ---------------------------------------------------------------------------
# Graph-level types
# ---------------------------------------------------------------------------

class NodeType(str, Enum):
    ACCUSED = "accused"
    VICTIM = "victim"
    COMPLAINANT = "complainant"
    EMPLOYEE = "employee"
    UNIT = "unit"
    CASE = "case"


class RelationType(str, Enum):
    BELONGS_TO_CASE = "belongs_to_case"        # Accused/Victim/Complainant -> Case
    EMPLOYEE_OF_UNIT = "employee_of_unit"       # Employee -> Unit
    ARRESTED = "arrested"                       # Employee -> Accused
    CO_ACCUSED = "co_accused"                   # Accused <-> Accused, same case
    VICTIM_ACCUSED = "victim_accused"           # Victim <-> Accused, same case
    COMPLAINANT_VICTIM = "complainant_victim"   # Complainant <-> Victim, same case


@dataclass
class GraphNode:
    """A single node in the investigation graph, generic across entity types."""
    id: str
    label: str
    type: NodeType
    attributes: Dict[str, Any] = field(default_factory=dict)


@dataclass
class GraphEdge:
    """
    A relationship link between two nodes. One edge per pair; if two nodes
    are linked through more than one relation, `relations` holds all of
    them and `weight` reflects the count.
    """
    source: str  # GraphNode.id
    target: str  # GraphNode.id
    relations: List[RelationType]
    weight: int


@dataclass
class GraphResult:
    """Internal representation of the built investigation graph."""
    nodes: List[GraphNode]
    edges: List[GraphEdge]


# ---- Cytoscape.js-compatible output shapes ----
# Cytoscape expects: { data: { ...fields } } for both nodes and edges.

class CytoscapeNodeData(TypedDict, total=False):
    id: str
    label: str
    type: str
    attributes: Dict[str, Any]


class CytoscapeNode(TypedDict):
    data: CytoscapeNodeData


class CytoscapeEdgeData(TypedDict, total=False):
    id: str
    source: str
    target: str
    relations: List[str]
    weight: int


class CytoscapeEdge(TypedDict):
    data: CytoscapeEdgeData


class CytoscapeGraph(TypedDict):
    nodes: List[CytoscapeNode]
    edges: List[CytoscapeEdge]