"""
CyberLens — Comprehensive Evaluation Coordinator
Runs or loads both Supervised Classification and Unsupervised Clustering pipelines,
producing a consolidated academic comparison benchmark.
"""

import json
import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.classification import train_classification_pipeline
from ml.clustering import train_clustering_pipeline


def run_full_evaluation():
    print("\n=======================================================")
    print(" CYBERLENS — UNIFIED COMPARATIVE ML EVALUATION")
    print("=======================================================\n")

    cls_json = os.path.join(PROJECT_ROOT, "results", "classification_results.json")
    clu_json = os.path.join(PROJECT_ROOT, "results", "clustering_results.json")

    if not os.path.exists(cls_json):
        print("[Evaluating] Running Supervised Classification pipeline...")
        train_classification_pipeline()

    if not os.path.exists(clu_json):
        print("[Evaluating] Running Unsupervised Clustering pipeline...")
        train_clustering_pipeline()

    with open(cls_json, 'r') as f:
        cls_data = json.load(f)

    with open(clu_json, 'r') as f:
        clu_data = json.load(f)

    rf = cls_data['primary_model']
    lr = cls_data['baseline_model']
    cm = cls_data['confusion_matrix']

    print("-------------------------------------------------------")
    print(" 1. SUPERVISED CLASSIFICATION BENCHMARK")
    print("-------------------------------------------------------")
    print(f" Primary Model        : {rf['model_name']}")
    print(f" Holdout Accuracy     : {rf['accuracy'] * 100:.2f}%")
    print(f" Precision            : {rf['precision'] * 100:.2f}%")
    print(f" Recall (Sensitivity) : {rf['recall'] * 100:.2f}%")
    print(f" F1 Score             : {rf['f1_score'] * 100:.2f}%")
    print(f" ROC-AUC Score        : {rf['roc_auc']:.4f}")
    print(f" Confusion Matrix     : TN={cm['true_negative']:,} | FP={cm['false_positive']:,} | FN={cm['false_negative']:,} | TP={cm['true_positive']:,}")
    print(f" Baseline Model (LR)  : Accuracy={lr['accuracy']*100:.2f}% | F1={lr['f1_score']*100:.2f}% | ROC-AUC={lr['roc_auc']:.4f}")

    print("\n-------------------------------------------------------")
    print(" 2. UNSUPERVISED CLUSTERING BENCHMARK")
    print("-------------------------------------------------------")
    print(f" Algorithm            : K-Means Clustering (Zero Labels Used)")
    print(f" Optimal Clusters (K) : {clu_data['optimal_k']}")
    print(f" Silhouette Score     : {clu_data['best_silhouette_score']:.4f}")
    print(f" PCA Variance Expl.   : PC1 ({clu_data['pca_variance_explained'][0]*100:.1f}%), PC2 ({clu_data['pca_variance_explained'][1]*100:.1f}%)")
    print("\n Discovered Behavioral Archetypes:")
    for p in clu_data['cluster_profiles']:
        print(f"   * Cluster {p['cluster_id']}: {p['name']} ({p['record_count']:,} flows, {p['percentage']}%) -> Post-hoc Attack: {p['post_hoc_attack_pct']}%")

    print("\n=======================================================")
    print(" EVALUATION COMPLETED SUCCESSFULLY")
    print("=======================================================\n")


if __name__ == '__main__':
    run_full_evaluation()
