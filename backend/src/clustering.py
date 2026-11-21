
import sys
from pathlib import Path

# Add current directory to path so preprocessing can be imported from anywhere
sys.path.append(str(Path(__file__).resolve().parent))

import matplotlib.pyplot as plt
import joblib
from sklearn.cluster import KMeans
from preprocessing import preprocess_data


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

VISUALIZATION_DIR = BASE_DIR / "visualizations"
VISUALIZATION_DIR.mkdir(parents=True, exist_ok=True)


# Load preprocessed data
X, X_scaled, scaler = preprocess_data()


# Train final K-Means model
kmeans = KMeans(
    n_clusters=5,
    init="k-means++",
    random_state=42,
    n_init=10
)

# Fit the model
kmeans.fit(X_scaled)

# Predict cluster labels
labels = kmeans.predict(X_scaled)


# Add cluster labels to original data
X_result = X.copy()
X_result["Cluster"] = labels


# Save trained model
joblib.dump(kmeans, MODEL_DIR / "kmeans_model.pkl")


# Save clustered customer data
X_result.to_csv(
    BASE_DIR / "dataset" / "clustered_customers.csv",
    index=False
)


# Display cluster information
print("\nCluster Distribution:")
print(X_result["Cluster"].value_counts().sort_index())


print("\nCluster Centers:")
print(kmeans.cluster_centers_)


# Visualize clusters
plt.figure(figsize=(10, 6))

plt.scatter(
    X_scaled[:, 0],
    X_scaled[:, 1],
    c=labels,
    cmap="viridis",
    s=50
)

plt.scatter(
    kmeans.cluster_centers_[:, 0],
    kmeans.cluster_centers_[:, 1],
    marker="X",
    color="red",
    s=200,
    label="Centroids"
)

plt.title("Mall Customer Segmentation")
plt.xlabel("Annual Income (Scaled)")
plt.ylabel("Spending Score (Scaled)")
plt.legend()

plt.savefig(VISUALIZATION_DIR / "customer_clusters.png")
plt.close()

print("\nK-Means Model Trained Successfully!")
