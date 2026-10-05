"""
CyberLens — FastAPI Backend Application
AI-Based Network Behavior Intelligence REST API.
Exposes Supervised Classification, Unsupervised Clustering, and Dataset Explorer services.
"""

import math
import os
import sys
from typing import Optional
import numpy as np
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.schemas import (
    HealthResponse,
    ClassificationPredictRequest,
    ClassificationPredictResponse,
    ClusteringPredictRequest,
    ClusteringPredictResponse,
    DatasetPaginationResponse
)
from backend.utils import (
    get_dataset,
    get_classification_artifacts,
    get_clustering_artifacts,
    get_classification_results,
    get_clustering_results
)

app = FastAPI(
    title="CyberLens API",
    description="AI-Based Network Behavior Intelligence — Comparing Classification & Clustering",
    version="1.0.0"
)

# Enable CORS for local Vite development & network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health_check():
    df = get_dataset()
    rf, _ = get_classification_artifacts()
    km, _, _ = get_clustering_artifacts()

    return HealthResponse(
        status="healthy",
        dataset_loaded=df is not None,
        dataset_rows=len(df) if df is not None else 0,
        classification_model_loaded=rf is not None,
        clustering_model_loaded=km is not None,
        version="1.0.0"
    )


@app.get("/api/stats")
def get_system_stats():
    df = get_dataset()
    cls_res = get_classification_results()
    clu_res = get_clustering_results()

    total_rows = len(df)
    attack_count = int(df['is_attack'].sum())
    normal_count = total_rows - attack_count
    attack_breakdown = df['attack_type'].value_counts().to_dict()

    return {
        "total_records": total_rows,
        "normal_records": normal_count,
        "attack_records": attack_count,
        "attack_percentage": round(attack_count / total_rows * 100, 2),
        "attack_type_breakdown": attack_breakdown,
        "features_total": 42,
        "models": {
            "classification": {
                "algorithm": cls_res['primary_model']['model_name'],
                "accuracy": cls_res['primary_model']['accuracy'],
                "f1_score": cls_res['primary_model']['f1_score'],
                "roc_auc": cls_res['primary_model']['roc_auc']
            },
            "clustering": {
                "algorithm": "K-Means",
                "optimal_k": clu_res['optimal_k'],
                "silhouette_score": clu_res['best_silhouette_score']
            }
        }
    }


@app.get("/api/classification/metrics")
def get_classification_metrics():
    return get_classification_results()


@app.post("/api/classification/predict", response_model=ClassificationPredictResponse)
def predict_classification(req: ClassificationPredictRequest):
    model, preprocessor = get_classification_artifacts()

    # Build input feature map
    input_dict = req.model_dump()
    X_scaled = preprocessor.transform_single_dict(input_dict)

    pred_class = int(model.predict(X_scaled)[0])
    probabilities = model.predict_proba(X_scaled)[0]
    attack_prob = float(round(probabilities[1] * 100, 2))

    # Determine risk level & visual color
    if attack_prob < 25.0:
        risk_level = "LOW"
        risk_color = "#10B981"  # Emerald
    elif attack_prob < 60.0:
        risk_level = "MEDIUM"
        risk_color = "#F59E0B"  # Amber
    elif attack_prob < 85.0:
        risk_level = "HIGH"
        risk_color = "#F97316"  # Orange
    else:
        risk_level = "CRITICAL"
        risk_color = "#EF4444"  # Red

    prediction_label = "ATTACK DETECTED" if pred_class == 1 else "NORMAL TRAFFIC"

    # Analyze contributing indicators
    factors = []
    if req.packet_rate > 500:
        factors.append(f"Elevated Packet Rate ({req.packet_rate:,.1f} pkts/s) indicates potential flooding/burst")
    if req.unique_destination_ports > 10:
        factors.append(f"High Unique Destination Ports ({req.unique_destination_ports}) indicates port reconnaissance")
    if req.failed_login_attempts >= 5:
        factors.append(f"Excessive Failed Logins ({req.failed_login_attempts}) indicates brute-force/credential abuse")
    if req.data_exfiltration_score > 30:
        factors.append(f"Elevated Data Exfiltration Score ({req.data_exfiltration_score:.1f}) indicates data leakage")
    if req.connection_count > 50:
        factors.append(f"Abnormal Concurrent Connection Count ({req.connection_count})")
    if req.syn_count > 20:
        factors.append(f"High TCP SYN Count ({req.syn_count}) indicates SYN flood probing")
    if not factors:
        if pred_class == 1:
            factors.append("Multivariate anomaly pattern detected across packet size and duration ratios")
        else:
            factors.append("All network flow telemetry metrics align within normal benign operational thresholds")

    return ClassificationPredictResponse(
        prediction=prediction_label,
        is_attack=pred_class,
        attack_probability=attack_prob,
        risk_level=risk_level,
        risk_color=risk_color,
        confidence=round(max(probabilities) * 100, 2),
        contributing_factors=factors
    )


@app.get("/api/clustering/metrics")
def get_clustering_metrics_api():
    return get_clustering_results()


@app.post("/api/clustering/predict", response_model=ClusteringPredictResponse)
def predict_clustering(req: ClusteringPredictRequest):
    model, preprocessor, _ = get_clustering_artifacts()
    clu_res = get_clustering_results()
    profiles = {p['cluster_id']: p for p in clu_res['cluster_profiles']}

    input_dict = req.model_dump()
    X_scaled = preprocessor.transform_single_dict(input_dict)

    cluster_id = int(model.predict(X_scaled)[0])
    centroid = model.cluster_centers_[cluster_id]
    distance = float(round(np.linalg.norm(X_scaled - centroid), 4))

    profile = profiles.get(cluster_id, {
        'name': f"Behavioral Cluster {cluster_id}",
        'badge': "DISCOVERED_GROUP",
        'color': "#06B6D4",
        'description': "Autonomous pattern discovered via feature proximity.",
        'post_hoc_attack_pct': 0.0,
        'dominant_protocol': "TCP"
    })

    return ClusteringPredictResponse(
        cluster_id=cluster_id,
        cluster_name=profile['name'],
        badge=profile['badge'],
        color=profile['color'],
        description=profile['description'],
        distance_to_center=distance,
        post_hoc_attack_pct=profile['post_hoc_attack_pct'],
        dominant_protocol=profile.get('dominant_protocol', 'TCP')
    )


@app.get("/api/clusters")
def get_clusters_list():
    clu_res = get_clustering_results()
    return {
        "optimal_k": clu_res['optimal_k'],
        "best_silhouette_score": clu_res['best_silhouette_score'],
        "profiles": clu_res['cluster_profiles']
    }


@app.get("/api/pca")
def get_pca_points():
    clu_res = get_clustering_results()
    return {
        "points": clu_res['pca_visualization_sample'],
        "variance_explained": clu_res['pca_variance_explained']
    }


@app.get("/api/dataset", response_model=DatasetPaginationResponse)
def get_paginated_dataset(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=5, le=100),
    attack_type: Optional[str] = None,
    is_attack: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "flow_id",
    sort_order: Optional[str] = "asc"
):
    df = get_dataset()

    filtered = df
    if attack_type and attack_type.strip() and attack_type != "All":
        filtered = filtered[filtered['attack_type'].str.lower() == attack_type.strip().lower()]

    if is_attack is not None:
        filtered = filtered[filtered['is_attack'] == is_attack]

    if search and search.strip():
        q = search.strip().lower()
        mask = (
            filtered['flow_id'].str.lower().str.contains(q, na=False) |
            filtered['source_ip'].str.lower().str.contains(q, na=False) |
            filtered['destination_ip'].str.lower().str.contains(q, na=False) |
            filtered['attack_type'].str.lower().str.contains(q, na=False)
        )
        filtered = filtered[mask]

    total_records = len(filtered)
    total_pages = max(1, math.ceil(total_records / limit))
    current_page = min(page, total_pages)

    if sort_by and sort_by in filtered.columns:
        ascending = (sort_order.lower() == "asc")
        filtered = filtered.sort_values(by=sort_by, ascending=ascending)

    start_idx = (current_page - 1) * limit
    end_idx = start_idx + limit
    page_data = filtered.iloc[start_idx:end_idx].to_dict(orient="records")

    return DatasetPaginationResponse(
        items=page_data,
        total=total_records,
        page=current_page,
        limit=limit,
        pages=total_pages
    )


@app.get("/api/feature-importance")
def get_feature_importance():
    cls_res = get_classification_results()
    return {
        "top_features": cls_res['top_features'],
        "all_features": cls_res['all_features'],
        "scientific_disclaimer": (
            "Feature importance is based on mean decrease in Gini impurity across the Random Forest trees. "
            "High importance indicates strong predictive reliance for distinguishing attacks from normal traffic, "
            "but does not imply direct physical causality."
        )
    }
