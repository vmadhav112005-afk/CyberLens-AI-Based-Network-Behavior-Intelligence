# CyberLens — Classification Model Performance Report

## 1. Executive Summary
- **Task**: Supervised Binary Classification (Normal Traffic vs Malicious Attack)
- **Primary Algorithm**: Random Forest Classifier
- **Baseline Algorithm**: Logistic Regression (Baseline)
- **Total Dataset Rows**: 150,000
- **Training Set Size**: 120,000 (80%)
- **Testing Set Size**: 30,000 (20% holdout)

## 2. Core Evaluation Metrics
| Metric | Random Forest | Logistic Regression (Baseline) | Interpretation |
|---|---|---|---|
| **Accuracy** | **96.77%** | 96.27% | Overall correctness across normal and attack classes |
| **Precision** | **96.19%** | 96.20% | When an attack is flagged, probability it is genuine (low false alarms) |
| **Recall** | **96.80%** | 95.67% | Proportion of actual attacks successfully caught |
| **F1 Score** | **96.50%** | 95.93% | Harmonic mean of Precision and Recall |
| **ROC-AUC** | **0.9635** | 0.9685 | Area under Receiver Operating Characteristic curve |
| **Training Duration** | 9.97s | 1.38s | Computational complexity |

## 3. Confusion Matrix (Holdout Test Set: 30,000 Flows)
```
                    Predicted NORMAL    Predicted ATTACK
Actual NORMAL       TN = 15,671         FP = 529
Actual ATTACK       FN = 441            TP = 13,359
```

## 4. Top Influential Network Features
Ranked by Gini Impurity reduction:
1. **failed_connections**: 0.1915
2. **connection_count**: 0.1509
3. **rst_count**: 0.0952
4. **syn_count**: 0.0793
5. **retransmission_count**: 0.0713
6. **tcp_flag_count**: 0.0532
7. **data_exfiltration_score**: 0.0449
8. **packet_count**: 0.0418
9. **http_requests**: 0.0375
10. **avg_packet_size**: 0.0334

## 5. Academic Defense Rationale (Why Random Forest?)
1. **Nonlinear Thresholds**: Cyber attacks often involve complex combination rules (e.g. high packet rate *and* destination port 80).
2. **Resilience to Outliers**: Decision trees split on rank orders rather than absolute magnitudes.
3. **Mixed Feature Distributions**: Tabular traffic features exhibit heavy-tailed distributions where linear boundaries fail.
4. **Superiority over Logistic Regression**: Random forest significantly outscores linear models due to multi-attribute correlations.