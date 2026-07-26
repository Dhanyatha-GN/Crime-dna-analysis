from flask import Blueprint, request, jsonify

from backend.services.summary import generate_summary

summary_bp = Blueprint("summary", __name__)


@summary_bp.route("/summary", methods=["POST"])
def create_summary():
    """
    Generate an AI investigation summary from Crime DNA results.
    """
    try:
        crime_data = request.get_json()

        if not crime_data:
            return jsonify({"error": "No input data provided."}), 400

        result = generate_summary(crime_data)

        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        return jsonify(
            {
                "error": "Internal Server Error",
                "details": str(e)
            }
        ), 500
