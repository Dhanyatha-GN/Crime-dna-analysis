import os
import sys

print("Current working directory:", os.getcwd())
print("Current file:", __file__)
print("Files in function directory:", os.listdir(os.path.dirname(__file__)))
print("Python path:", sys.path)
# Add the function directory to Python's import path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Request, jsonify
import zcatalyst_sdk

from backend.services.network import generate_network_graph


def handler(request: Request):
    try:
        catalyst_app = zcatalyst_sdk.initialize()

        case_id = request.args.get("case_id")

        graph = generate_network_graph(
            case_id=case_id,
            catalyst_app=catalyst_app
        )

        return jsonify(graph), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500