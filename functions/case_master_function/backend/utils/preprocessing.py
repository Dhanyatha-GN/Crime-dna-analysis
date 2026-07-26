import pandas as pd
import numpy as np
from typing import Optional
def load_dataset(file_path: str) -> pd.DataFrame:
    """
    Load a dataset from CSV or JSON into a Pandas DataFrame.
    """
    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file_path.endswith(".json"):
            df = pd.read_json(file_path)
        else:
            raise ValueError("Unsupported file format. Use CSV or JSON.")
        return df
    except Exception as e:
        raise RuntimeError(f"Error loading dataset: {e}")


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the dataset by handling missing values, duplicates, and text normalization.
    """
    try:
        # Drop duplicate rows
        df = df.drop_duplicates()

        # Handle missing values (fill numeric with 0, text with empty string)
        for col in df.columns:
            if df[col].dtype == "object":
                df[col] = df[col].fillna("").str.strip().str.lower()
            else:
                df[col] = df[col].fillna(0)

        return df
    except Exception as e:
        raise RuntimeError(f"Error cleaning dataset: {e}")


def encode_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Encode categorical features and ensure numeric columns are properly typed.
    """
    try:
        # Example: one-hot encode categorical columns
        categorical_cols = df.select_dtypes(include=["object"]).columns
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

        # Ensure numeric columns are float
        for col in df.columns:
            if np.issubdtype(df[col].dtype, np.number):
                df[col] = df[col].astype(float)

        return df
    except Exception as e:
        raise RuntimeError(f"Error encoding features: {e}")
