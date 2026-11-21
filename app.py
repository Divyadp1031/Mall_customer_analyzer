import os
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory

# Base paths
BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "backend" / "dataset" / "Mall_Customers.csv"
SCALER_PATH = BASE_DIR / "backend" / "models" / "scaler.pkl"
MODEL_PATH = BASE_DIR / "backend" / "models" / "kmeans_model.pkl"

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")

# Enable CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

# Cluster Persona Definitions
CLUSTER_META = {
    0: {
        "id": 0,
        "name": "Standard / Balanced",
        "tag": "Balanced Shoppers",
        "description": "Customers with middle-tier income and moderate spending habits. They represent the mall's reliable core audience.",
        "color": "#3B82F6", # Blue
        "traits": [
            "Middle income brackets ($40k-$70k)",
            "Predictable, steady shopping behavior",
            "Responsive to seasonal sales and member discounts",
            "Values practical quality and customer service"
        ],
        "strategies": [
            "Enroll in standard loyalty reward points programs",
            "Send weekly newsletter specials and holiday bundle deals",
            "Promote everyday value items and mid-tier brands"
        ]
    },
    1: {
        "id": 1,
        "name": "VIP / High Spenders",
        "tag": "High Income & High Spend",
        "description": "High-income earners with high spending scores. These are prime target consumers for premium and luxury brands.",
        "color": "#10B981", # Emerald
        "traits": [
            "Affluent earners ($70k-$140k)",
            "High appetite for luxury, fashion, and experiences",
            "Brand-conscious and status-driven",
            "Low price sensitivity, prioritizes exclusivity"
        ],
        "strategies": [
            "VIP concierge service and private shopping events",
            "Exclusive early access to new designer collections",
            "Personalized loyalty perks, concierge lounges, free valet"
        ]
    },
    2: {
        "id": 2,
        "name": "Young Trendsetters",
        "tag": "Low Income & High Spend",
        "description": "Younger customers with modest earnings but high spending enthusiasm. They love trends, social experiences, and lifestyle merchandise.",
        "color": "#EC4899", # Pink
        "traits": [
            "Predominantly young demographic (avg age ~25)",
            "High interest in fashion, dining, and trends",
            "Active on social media and influencer-inspired",
            "Spends heavily on apparel, entertainment, and cafes"
        ],
        "strategies": [
            "Host social media influencer collaborations & pop-up events",
            "Promote flexible digital payment solutions",
            "Offer student perks, student discounts, and youth loyalty badges"
        ]
    },
    3: {
        "id": 3,
        "name": "Careful Savers",
        "tag": "High Income & Low Spend",
        "description": "High-income earners with conservative spending habits. They are deliberate, rational buyers who evaluate value before purchasing.",
        "color": "#F59E0B", # Amber
        "traits": [
            "High purchasing power ($70k-$140k) but cautious spending",
            "Research-driven and value-oriented",
            "Prefers durable, high-utility investments over fast fashion",
            "Focuses on quality and long-term utility"
        ],
        "strategies": [
            "Emphasize durability, product warranty, and premium build",
            "Offer high-value rebate offers and member cashback",
            "Promotions for electronics, home improvement, and financial services"
        ]
    },
    4: {
        "id": 4,
        "name": "Budget Shoppers",
        "tag": "Low Income & Low Spend",
        "description": "Customers with modest income and cautious spending. They prioritize essentials, budget-friendliness, and discounts.",
        "color": "#8B5CF6", # Purple
        "traits": [
            "Careful budget planning ($15k-$40k)",
            "Essential and price-sensitive shopping",
            "Infrequent visits, seeks steep discounts and clearance deals",
            "Values practical everyday necessities"
        ],
        "strategies": [
            "Clearance event alerts and seasonal coupon booklets",
            "Highlight grocery essentials and budget-friendly stores",
            "Promote family discount days and bundled basics"
        ]
    }
}

# Load Model, Scaler, and Dataset
def load_resources():
    scaler = None
    kmeans = None
    df = None

    if SCALER_PATH.exists():
        scaler = joblib.load(SCALER_PATH)
    if MODEL_PATH.exists():
        kmeans = joblib.load(MODEL_PATH)

    if DATASET_PATH.exists():
        raw_df = pd.read_csv(DATASET_PATH)
        df = raw_df.rename(columns={
            "CustomerID": "customer_id",
            "Gender": "gender",
            "Age": "age",
            "Annual Income (k$)": "annual_income",
            "Spending Score (1-100)": "spending_score"
        })

        if scaler is not None and kmeans is not None:
            features = pd.DataFrame(
                df[["annual_income", "spending_score"]].values,
                columns=["Annual Income (k$)", "Spending Score (1-100)"]
            )
            X_scaled = scaler.transform(features)
            df["cluster"] = kmeans.predict(X_scaled)
            df["cluster_name"] = df["cluster"].map(lambda c: CLUSTER_META.get(c, {}).get("name", f"Cluster {c}"))
            df["cluster_color"] = df["cluster"].map(lambda c: CLUSTER_META.get(c, {}).get("color", "#6B7280"))
    
    return scaler, kmeans, df

scaler, kmeans, customers_df = load_resources()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model_loaded": kmeans is not None,
        "scaler_loaded": scaler is not None,
        "total_records": len(customers_df) if customers_df is not None else 0
    })

@app.route("/api/stats", methods=["GET"])
def get_stats():
    if customers_df is None:
        return jsonify({"error": "Dataset not loaded"}), 500

    total_customers = int(len(customers_df))
    avg_age = round(float(customers_df["age"].mean()), 1)
    avg_income = round(float(customers_df["annual_income"].mean()), 1)
    avg_spending = round(float(customers_df["spending_score"].mean()), 1)

    gender_counts = customers_df["gender"].value_counts().to_dict()
    cluster_counts = customers_df["cluster"].value_counts().to_dict()

    cluster_distribution = []
    for c_id, meta in CLUSTER_META.items():
        count = int(cluster_counts.get(c_id, 0))
        pct = round((count / total_customers) * 100, 1) if total_customers else 0
        cluster_distribution.append({
            "cluster": c_id,
            "name": meta["name"],
            "tag": meta["tag"],
            "count": count,
            "percentage": pct,
            "color": meta["color"]
        })

    return jsonify({
        "total_customers": total_customers,
        "avg_age": avg_age,
        "avg_income": avg_income,
        "avg_spending": avg_spending,
        "gender_distribution": {
            "female": int(gender_counts.get("Female", 0)),
            "male": int(gender_counts.get("Male", 0))
        },
        "clusters": cluster_distribution
    })

@app.route("/api/customers", methods=["GET"])
def get_customers():
    if customers_df is None:
        return jsonify({"error": "Dataset not loaded"}), 500

    filtered_df = customers_df.copy()

    # Filters
    gender = request.args.get("gender")
    if gender and gender.lower() != "all":
        filtered_df = filtered_df[filtered_df["gender"].str.lower() == gender.lower()]

    cluster = request.args.get("cluster")
    if cluster is not None and cluster != "" and cluster.lower() != "all":
        try:
            filtered_df = filtered_df[filtered_df["cluster"] == int(cluster)]
        except ValueError:
            pass

    search = request.args.get("search", "").strip()
    if search:
        if search.isdigit():
            filtered_df = filtered_df[filtered_df["customer_id"] == int(search)]
        else:
            filtered_df = filtered_df[
                filtered_df["cluster_name"].str.contains(search, case=False, na=False) |
                filtered_df["gender"].str.contains(search, case=False, na=False)
            ]

    # Convert to list of dicts
    records = filtered_df.to_dict(orient="records")
    return jsonify({
        "total": len(records),
        "customers": records
    })

@app.route("/api/clusters", methods=["GET"])
def get_clusters():
    if customers_df is None or kmeans is None or scaler is None:
        return jsonify({"error": "Models or dataset not loaded"}), 500

    # Calculate cluster centroids in original scale
    raw_centroids = scaler.inverse_transform(kmeans.cluster_centers_)

    cluster_profiles = []
    for c_id in sorted(CLUSTER_META.keys()):
        meta = CLUSTER_META[c_id]
        c_df = customers_df[customers_df["cluster"] == c_id]
        
        centroid_income = round(float(raw_centroids[c_id][0]), 1)
        centroid_spending = round(float(raw_centroids[c_id][1]), 1)
        
        count = len(c_df)
        pct = round((count / len(customers_df)) * 100, 1)

        gender_dist = c_df["gender"].value_counts().to_dict()

        cluster_profiles.append({
            "id": c_id,
            "name": meta["name"],
            "tag": meta["tag"],
            "color": meta["color"],
            "description": meta["description"],
            "count": count,
            "percentage": pct,
            "centroid": {
                "annual_income": centroid_income,
                "spending_score": centroid_spending
            },
            "metrics": {
                "avg_age": round(float(c_df["age"].mean()), 1) if count else 0,
                "avg_income": round(float(c_df["annual_income"].mean()), 1) if count else 0,
                "avg_spending": round(float(c_df["spending_score"].mean()), 1) if count else 0,
                "min_income": int(c_df["annual_income"].min()) if count else 0,
                "max_income": int(c_df["annual_income"].max()) if count else 0,
                "min_spending": int(c_df["spending_score"].min()) if count else 0,
                "max_spending": int(c_df["spending_score"].max()) if count else 0,
                "female_count": int(gender_dist.get("Female", 0)),
                "male_count": int(gender_dist.get("Male", 0))
            },
            "traits": meta["traits"],
            "strategies": meta["strategies"]
        })

    return jsonify({
        "clusters": cluster_profiles,
        "centroids": [
            {
                "cluster": i,
                "name": CLUSTER_META[i]["name"],
                "color": CLUSTER_META[i]["color"],
                "annual_income": round(float(raw_centroids[i][0]), 1),
                "spending_score": round(float(raw_centroids[i][1]), 1)
            }
            for i in range(len(raw_centroids))
        ]
    })

@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    if kmeans is None or scaler is None:
        return jsonify({"error": "ML Model or Scaler not loaded"}), 500

    data = request.get_json(silent=True) or {}
    try:
        annual_income = float(data.get("annual_income", 0))
        spending_score = float(data.get("spending_score", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid annual_income or spending_score format"}), 400

    age = data.get("age", 30)
    gender = data.get("gender", "Female")

    # Scale the input using matching feature names
    input_df = pd.DataFrame(
        [[annual_income, spending_score]],
        columns=["Annual Income (k$)", "Spending Score (1-100)"]
    )
    input_scaled = scaler.transform(input_df)

    # Predict cluster
    cluster_id = int(kmeans.predict(input_scaled)[0])
    
    # Calculate Euclidean distance to each scaled centroid
    distances = np.linalg.norm(kmeans.cluster_centers_ - input_scaled, axis=1)
    closest_distance = float(distances[cluster_id])
    
    meta = CLUSTER_META.get(cluster_id, {
        "id": cluster_id,
        "name": f"Cluster {cluster_id}",
        "tag": "Customer Segment",
        "description": "Segment classification based on spending and income patterns.",
        "color": "#6366F1",
        "traits": [],
        "strategies": []
    })

    return jsonify({
        "prediction": {
            "cluster_id": cluster_id,
            "cluster_name": meta["name"],
            "cluster_tag": meta["tag"],
            "color": meta["color"],
            "description": meta["description"],
            "traits": meta["traits"],
            "strategies": meta["strategies"],
            "confidence_score": round(max(0, 100 - (closest_distance * 30)), 1),
            "input": {
                "annual_income": annual_income,
                "spending_score": spending_score,
                "age": age,
                "gender": gender
            }
        }
    })

@app.route("/api/scatter-data", methods=["GET"])
def scatter_data():
    if customers_df is None or kmeans is None or scaler is None:
        return jsonify({"error": "Dataset not loaded"}), 500

    raw_centroids = scaler.inverse_transform(kmeans.cluster_centers_)
    
    points = customers_df[[
        "customer_id", "gender", "age", "annual_income", "spending_score", "cluster", "cluster_name", "cluster_color"
    ]].to_dict(orient="records")

    centroids = [
        {
            "cluster": i,
            "name": CLUSTER_META[i]["name"],
            "color": CLUSTER_META[i]["color"],
            "annual_income": round(float(raw_centroids[i][0]), 1),
            "spending_score": round(float(raw_centroids[i][1]), 1)
        }
        for i in range(len(raw_centroids))
    ]

    return jsonify({
        "points": points,
        "centroids": centroids
    })

# Serve Frontend static assets if built
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    dist_dir = BASE_DIR / "frontend" / "dist"
    if dist_dir.exists() and (dist_dir / path).exists() and path != "":
        return send_from_directory(dist_dir, path)
    elif dist_dir.exists() and (dist_dir / "index.html").exists():
        return send_from_directory(dist_dir, "index.html")
    return jsonify({
        "message": "Mall Customer Analyzer API Server is running. Access endpoints under /api/*",
        "endpoints": [
            "/api/health",
            "/api/stats",
            "/api/customers",
            "/api/clusters",
            "/api/predict",
            "/api/scatter-data"
        ]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Mall Customer Analyzer Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
