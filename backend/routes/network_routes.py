"""
Flask routes for the Network Analysis module (CrimeDNA-X).

Exposes the investigation relationship graph as a REST resource. Delegates
all logic to services/network.py — this file only handles HTTP concerns
(request parsing, status codes, error responses).
"""

from flask import Blueprint, jsonify, request

from backend.services.network import NetworkServiceError, generate_network_graph

network_bp = Blueprint("network", __name__, url_prefix="/api/network")


@network_bp.route("/graph", methods=["GET"])
def get_network_graph():
    """
    GET /api/network/graph?case_id=<id>

    Returns the investigation relationship graph — Accused, Victim,
    Complainant, Employee, Unit, and Case nodes linked via CaseMasterID
    and ArrestSurrender records — as Cytoscape.js-compatible JSON.
    `case_id` is optional; omitting it returns the full graph.
    """
    case_id = request.args.get("case_id")  # None if not provided — never assumed

    try:
        graph = generate_network_graph(case_id=case_id)
        return jsonify(graph), 200

    except NetworkServiceError as exc:
        # Raised on Catalyst SDK init failures or ZCQL query failures.
        return jsonify({"error": "network_data_unavailable", "message": str(exc)}), 502

    except Exception as exc:  # noqa: BLE001 — final safety net at the API boundary
        return jsonify({"error": "internal_server_error", "message": str(exc)}), 500