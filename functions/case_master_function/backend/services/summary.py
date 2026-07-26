from typing import Dict, Any


def generate_summary(crime_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Generate a human-readable investigation summary
    from Crime DNA analysis results.
    """

    if not crime_data:
        raise ValueError("Crime data is empty.")

    crime_type = crime_data.get("crime_type", "Unknown Crime")
    similar_cases = crime_data.get("similar_cases", 0)
    similarity = crime_data.get("similarity", 0.0)
    active_time = crime_data.get("active_time", "Unknown")
    top_suspects = crime_data.get("top_suspects", [])

    summary = (
        f"This {crime_type} case matches {similar_cases} previous case(s) "
        f"with a similarity score of {similarity:.0%}. "
        f"Most incidents occurred during {active_time}."
    )

    if top_suspects:
        suspects = ", ".join(map(str, top_suspects))
        summary += f" Recommended suspects for investigation: {suspects}."

    return {
        "summary": summary
    }
