import numpy as np
import pandas as pd
from typing import List, Tuple
def generate_crime_dna(df: pd.DataFrame) -> np.ndarray:
    """
    Convert the encoded dataset into numeric vectors (Crime DNA).
    Each offender's record becomes a vector.
    """
    if df.empty:
        raise ValueError("Dataset is empty. Cannot generate Crime DNA.")
    return df.values


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Compute cosine similarity between two vectors.
    """
    if vec1.shape != vec2.shape:
        raise ValueError("Vectors must have the same shape.")
    dot_product = np.dot(vec1, vec2)
    norm_a = np.linalg.norm(vec1)
    norm_b = np.linalg.norm(vec2)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def find_similar_offenders(target_id: int, df: pd.DataFrame, top_n: int = 5) -> List[Tuple[int, float]]:
    """
    Find offenders most similar to the given target offender.
    Returns a list of (offender_id, similarity_score).
    """
    if "offender_id" not in df.columns:
        raise ValueError("Dataset must contain 'offender_id' column.")

    if target_id not in df["offender_id"].values:
        raise ValueError(f"Target offender {target_id} not found in dataset.")

    # Extract target vector
    target_row = df[df["offender_id"] == target_id].drop(columns=["offender_id"])
    target_vec = target_row.values[0]

    # Compare with all others
    similarities = []
    for _, row in df.iterrows():
        if row["offender_id"] == target_id:
            continue
        other_vec = row.drop(labels=["offender_id"]).values
        score = cosine_similarity(target_vec, other_vec)
        similarities.append((row["offender_id"], score))

    # Sort by similarity score (highest first)
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_n]
