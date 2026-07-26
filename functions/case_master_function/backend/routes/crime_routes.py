from flask import Blueprint, request, jsonify
import pandas as pd

from backend.utils.preprocessing import load_dataset, clean_data, encode_features
from backend.services.crime_dna import generate_crime_dna, find_similar_offenders
from backend.models.behavior_profile import BehaviorProfile
crime_routes = Blueprint("crime_routes", __name__)

@crime_routes.route("/preprocess", methods=["POST"])
def preprocess_data():
    file_path = request.json.get("file_path")
    df = load_dataset(file_path)
    df = clean_data(df)
    df = encode_features(df)
    return jsonify({"message": "Dataset preprocessed successfully", "rows": len(df)})


@crime_routes.route("/crime-dna/<int:offender_id>", methods=["GET"])
def get_similar_offenders(offender_id):
    file_path = request.args.get("file_path")
    df = load_dataset(file_path)
    df = clean_data(df)
    df = encode_features(df)
    similar = find_similar_offenders(offender_id, df)
    return jsonify({"similar_offenders": similar})


@crime_routes.route("/behavior-profile/<int:offender_id>", methods=["GET"])
def get_behavior_profile(offender_id):
    # Load dataset
    df = pd.read_csv("sample.csv")

    # Find the offender row
    offender = df[df["offender_id"] == offender_id].iloc[0]

    # Traits from CSV
    traits = {
        "aggression": int(offender["aggression"]),
        "impulsivity": int(offender.get("impulsivity", 0))
    }

    # Crime patterns from CSV
    crime_patterns = {
        "crime_type": offender["crime_type"],
        "crime_frequency": int(offender["crime_frequency"])
    }

    # Build profile object
    profile = BehaviorProfile(offender_id, traits, crime_patterns)

    return jsonify(profile.to_dict())

