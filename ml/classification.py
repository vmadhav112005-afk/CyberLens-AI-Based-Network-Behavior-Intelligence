"""
CyberLens — Supervised Classification Pipeline
Trains Random Forest Classifier (and Logistic Regression benchmark) on network traffic.
Generates comprehensive metrics: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix,
ROC curve coordinates, PR curve coordinates, and Feature Importance.
"""

import json
import os
import sys
import time

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, precision_recall_curve
)

from ml.preprocessing import prepare_classification_data, NUMERICAL_FEATURES


def train_classification_pipeline(
    data_path: str = "data/network_traffic_dataset.csv",
    models_dir: str = "models",
    results_dir: str = "results"
):
    print("=======================================================")
    print(" CYBERLENS SUPERVISED CLASSIFICATION PIPELINE")
    print(" Target: Normal (0) vs Attack (1)")
    print(" Model: Random Forest Classifier (with Logistic Regression baseline)")
    print("=======================================================")

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(results_dir, exist_ok=True)

    print(f"\n[1/5] Loading network traffic dataset from {data_path} ...")
    start_load = time.time()
    df = pd.read_csv(data_path)
    print(f"      Loaded {len(df):,} records in {time.time() - start_load:.2f}s.")

    print("\n[2/5] Preparing 80/20 train/test split with zero data leakage...")
    X_train, X_test, y_train, y_test, preprocessor = prepare_classification_data(df, test_size=0.20, random_state=42)
    print(f"      Training samples: {X_train.shape[0]:,} | Test samples: {X_test.shape[0]:,}")
    print(f"      Features: {X_train.shape[1]}")

    print("\n[3/5] Training Random Forest Classifier (100 estimators, max_depth=18)...")
    rf_start = time.time()
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=18,
        min_samples_split=8,
        min_samples_leaf=4,
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    rf_time = time.time() - rf_start
    print(f"      Random Forest trained in {rf_time:.2f}s.")

    print("\n[4/5] Training Logistic Regression benchmark...")
    lr_start = time.time()
    lr = LogisticRegression(max_iter=500, random_state=42)
    lr.fit(X_train, y_train)
    lr_time = time.time() - lr_start
    print(f"      Logistic Regression trained in {lr_time:.2f}s.")

    print("\n[5/5] Evaluating performance on 20% holdout test set...")
    # Predictions
    y_pred_rf = rf.predict(X_test)
    y_prob_rf = rf.predict_proba(X_test)[:, 1]

    y_pred_lr = lr.predict(X_test)
    y_prob_lr = lr.predict_proba(X_test)[:, 1]

    # Metrics
    rf_metrics = {
        'model_name': 'Random Forest Classifier',
        'accuracy': float(round(accuracy_score(y_test, y_pred_rf), 4)),
        'precision': float(round(precision_score(y_test, y_pred_rf), 4)),
        'recall': float(round(recall_score(y_test, y_pred_rf), 4)),
        'f1_score': float(round(f1_score(y_test, y_pred_rf), 4)),
        'roc_auc': float(round(roc_auc_score(y_test, y_prob_rf), 4)),
        'training_time_sec': float(round(rf_time, 2))
    }

    lr_metrics = {
        'model_name': 'Logistic Regression (Baseline)',
        'accuracy': float(round(accuracy_score(y_test, y_pred_lr), 4)),
        'precision': float(round(precision_score(y_test, y_pred_lr), 4)),
        'recall': float(round(recall_score(y_test, y_pred_lr), 4)),
        'f1_score': float(round(f1_score(y_test, y_pred_lr), 4)),
        'roc_auc': float(round(roc_auc_score(y_test, y_prob_lr), 4)),
        'training_time_sec': float(round(lr_time, 2))
    }

    # Confusion Matrix for RF
    cm = confusion_matrix(y_test, y_pred_rf)
    cm_dict = {
        'true_negative': int(cm[0, 0]),
        'false_positive': int(cm[0, 1]),
        'false_negative': int(cm[1, 0]),
        'true_positive': int(cm[1, 1])
    }

    # ROC Curve points (downsample to 50 points for smooth web rendering)
    fpr, tpr, _ = roc_curve(y_test, y_prob_rf)
    idx = np.linspace(0, len(fpr) - 1, 50, dtype=int)
    roc_points = [{'fpr': round(float(fpr[i]), 4), 'tpr': round(float(tpr[i]), 4)} for i in idx]

    # PR Curve points
    precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_prob_rf)
    idx_pr = np.linspace(0, len(precision_vals) - 1, 50, dtype=int)
    pr_points = [{'recall': round(float(recall_vals[i]), 4), 'precision': round(float(precision_vals[i]), 4)} for i in idx_pr]

    # Feature Importances
    importances = rf.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    feature_ranking = [
        {
            'feature': NUMERICAL_FEATURES[i],
            'importance': round(float(importances[i]), 5),
            'rank': rank + 1
        }
        for rank, i in enumerate(sorted_idx)
    ]

    # Build complete results dict
    full_results = {
        'dataset_summary': {
            'total_samples': len(df),
            'train_samples': int(len(X_train)),
            'test_samples': int(len(X_test)),
            'features_count': len(NUMERICAL_FEATURES),
            'attack_rate_overall': round(float(df['is_attack'].mean()), 4)
        },
        'primary_model': rf_metrics,
        'baseline_model': lr_metrics,
        'confusion_matrix': cm_dict,
        'roc_curve': roc_points,
        'pr_curve': pr_points,
        'top_features': feature_ranking[:15],
        'all_features': feature_ranking
    }

    # Save models
    rf_model_path = os.path.join(models_dir, "classification_model.pkl")
    prep_path = os.path.join(models_dir, "classification_preprocessor.pkl")
    joblib.dump(rf, rf_model_path)
    joblib.dump(preprocessor, prep_path)
    print(f"\n[Saved] Models serialized to {rf_model_path} and {prep_path}")

    # Save JSON results
    json_path = os.path.join(results_dir, "classification_results.json")
    with open(json_path, 'w') as f:
        json.dump(full_results, f, indent=2)
    print(f"[Saved] Results JSON written to {json_path}")

    # Save Markdown report
    md_path = os.path.join(results_dir, "classification_results.md")
    with open(md_path, 'w') as f:
        f.write(generate_markdown_report(full_results))
    print(f"[Saved] Readable report written to {md_path}")

    # Print summary
    print("\n---------------- CLASSIFICATION EVALUATION RESULTS ----------------")
    print(f" Model              : {rf_metrics['model_name']}")
    print(f" Accuracy           : {rf_metrics['accuracy'] * 100:.2f}%")
    print(f" Precision          : {rf_metrics['precision'] * 100:.2f}%")
    print(f" Recall             : {rf_metrics['recall'] * 100:.2f}%")
    print(f" F1 Score           : {rf_metrics['f1_score'] * 100:.2f}%")
    print(f" ROC-AUC            : {rf_metrics['roc_auc']:.4f}")
    print("\n Confusion Matrix:")
    print(f"   TN: {cm_dict['true_negative']:,} | FP: {cm_dict['false_positive']:,}")
    print(f"   FN: {cm_dict['false_negative']:,} | TP: {cm_dict['true_positive']:,}")
    print(f"\n Comparison with Baseline (Logistic Regression):")
    print(f"   LR Accuracy      : {lr_metrics['accuracy'] * 100:.2f}% | F1: {lr_metrics['f1_score'] * 100:.2f}% | ROC-AUC: {lr_metrics['roc_auc']:.4f}")
    print("===================================================================\n")

    return full_results


def generate_markdown_report(results: dict) -> str:
    rf = results['primary_model']
    lr = results['baseline_model']
    cm = results['confusion_matrix']
    top_feats = results['top_features']

    lines = [
        "# CyberLens — Classification Model Performance Report",
        "",
        "## 1. Executive Summary",
        f"- **Task**: Supervised Binary Classification (Normal Traffic vs Malicious Attack)",
        f"- **Primary Algorithm**: {rf['model_name']}",
        f"- **Baseline Algorithm**: {lr['model_name']}",
        f"- **Total Dataset Rows**: {results['dataset_summary']['total_samples']:,}",
        f"- **Training Set Size**: {results['dataset_summary']['train_samples']:,} (80%)",
        f"- **Testing Set Size**: {results['dataset_summary']['test_samples']:,} (20% holdout)",
        "",
        "## 2. Core Evaluation Metrics",
        "| Metric | Random Forest | Logistic Regression (Baseline) | Interpretation |",
        "|---|---|---|---|",
        f"| **Accuracy** | **{rf['accuracy']*100:.2f}%** | {lr['accuracy']*100:.2f}% | Overall correctness across normal and attack classes |",
        f"| **Precision** | **{rf['precision']*100:.2f}%** | {lr['precision']*100:.2f}% | When an attack is flagged, probability it is genuine (low false alarms) |",
        f"| **Recall** | **{rf['recall']*100:.2f}%** | {lr['recall']*100:.2f}% | Proportion of actual attacks successfully caught |",
        f"| **F1 Score** | **{rf['f1_score']*100:.2f}%** | {lr['f1_score']*100:.2f}% | Harmonic mean of Precision and Recall |",
        f"| **ROC-AUC** | **{rf['roc_auc']:.4f}** | {lr['roc_auc']:.4f} | Area under Receiver Operating Characteristic curve |",
        f"| **Training Duration** | {rf['training_time_sec']}s | {lr['training_time_sec']}s | Computational complexity |",
        "",
        "## 3. Confusion Matrix (Holdout Test Set: 30,000 Flows)",
        "```",
        f"                    Predicted NORMAL    Predicted ATTACK",
        f"Actual NORMAL       TN = {cm['true_negative']:<14,d} FP = {cm['false_positive']:,d}",
        f"Actual ATTACK       FN = {cm['false_negative']:<14,d} TP = {cm['true_positive']:,d}",
        "```",
        "",
        "## 4. Top Influential Network Features",
        "Ranked by Gini Impurity reduction:",
    ]
    for feat in top_feats[:10]:
        lines.append(f"{feat['rank']}. **{feat['feature']}**: {feat['importance']:.4f}")

    lines.extend([
        "",
        "## 5. Academic Defense Rationale (Why Random Forest?)",
        "1. **Nonlinear Thresholds**: Cyber attacks often involve complex combination rules (e.g. high packet rate *and* destination port 80).",
        "2. **Resilience to Outliers**: Decision trees split on rank orders rather than absolute magnitudes.",
        "3. **Mixed Feature Distributions**: Tabular traffic features exhibit heavy-tailed distributions where linear boundaries fail.",
        "4. **Superiority over Logistic Regression**: Random forest significantly outscores linear models due to multi-attribute correlations."
    ])
    return "\n".join(lines)


if __name__ == '__main__':
    train_classification_pipeline()
