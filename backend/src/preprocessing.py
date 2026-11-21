
import pandas as pd
import joblib

from pathlib import Path
from sklearn.preprocessing import StandardScaler

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Load dataset
df = pd.read_csv(BASE_DIR / "dataset" / "Mall_Customers.csv")


def preprocess_data():

    # Select features
    X = df[['Annual Income (k$)', 'Spending Score (1-100)']]

    # Initialize scaler
    scaler = StandardScaler()

    # Scale the features
    X_scaled = scaler.fit_transform(X)

    # Save scaler
    joblib.dump(scaler, BASE_DIR / "models" / "scaler.pkl")

    print("Original Data:")
    print(X.head())

    print("\nScaled Data:")
    print(X_scaled[:5])

    print("\nDataset Shape:", X.shape)
    print("Preprocessing Completed!")

    return X, X_scaled, scaler


if __name__ == "__main__":
    X, X_scaled, scaler = preprocess_data()
