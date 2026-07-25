from typing import Dict, Any
class BehaviorProfile:
    """
    Represents an offender's behavior profile with traits, crime patterns, and risk score.
    """

    def __init__(self, offender_id: int, traits: Dict[str, Any], crime_patterns: Dict[str, Any]):
        self.offender_id = offender_id
        self.traits = traits
        self.crime_patterns = crime_patterns
        self.risk_score = self.calculate_risk_score()

    def calculate_risk_score(self) -> float:
        """
        Compute a simple risk score based on traits and crime patterns.
        Example: sum of weighted values.
        """
        score = 0.0

        # Example: weight aggression higher
        if "aggression" in self.traits:
            score += self.traits["aggression"] * 2

        # Example: add frequency of crimes
        if "crime_frequency" in self.crime_patterns:
            score += self.crime_patterns["crime_frequency"]

        # Normalize score
        return round(score, 2)

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the profile into a dictionary (useful for APIs).
        """
        return {
            "offender_id": self.offender_id,
            "traits": self.traits,
            "crime_patterns": self.crime_patterns,
            "risk_score": self.risk_score,
        }
