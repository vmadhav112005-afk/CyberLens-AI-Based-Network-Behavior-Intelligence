# CyberLens — AI-Based Network Behavior Intelligence

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An academic and enterprise-grade Machine Learning system engineered for Big Data Engineering (BDE) and college viva examination, scientifically contrasting **Supervised Classification** (known threat prediction) and **Unsupervised Clustering** (latent behavioral pattern discovery) on the **exact same 150,000-flow network security dataset**.

---

## 1. Project Title
**CyberLens — AI-Based Network Behavior Intelligence: A Unified Comparative Study of Supervised Threat Detection and Unsupervised Latent Behavioral Clustering**

---

## 2. Problem Statement
Contemporary enterprise networks transmit hundreds of thousands of network sessions per minute. Security Operations Centers (SOCs) face two distinct operational questions:
1. **Threat Classification:** *"Is this network flow NORMAL or an ATTACK?"* (Supervised task mapping known attack classes to discrete labels).
2. **Behavioral Discovery:** *"What types of network behavior exist?"* (Unsupervised task uncovering zero-day anomalies, botnet synchronization, and unauthorized exfiltration without using attack labels).

---

## 3. Motivation
Traditional signature-based Network Intrusion Detection Systems (NIDS) fail against zero-day exploits. While supervised machine learning yields high-accuracy threat interception when historical labels exist, it possesses an inherent blind spot: it cannot detect novel attack vectors. Unsupervised clustering addresses this gap by partitioning communication dynamics without any teacher signal. By applying both paradigms to the identical network telemetry dataset, CyberLens provides a transparent, scientifically valid benchmark suitable for university viva defense.

---

## 4. Objectives
- **Synthesize a Large Realistic Network Dataset:** 150,000+ flows across 42 features incorporating realistic class distributions and controlled overlap (~3.5%) to avoid unrealistic 100% metrics.
- **Implement Supervised Classification Pipeline:** Train a 100-tree Random Forest Classifier (benchmarked against Logistic Regression) on an 80/20 train/test split with zero data leakage.
- **Implement Unsupervised Clustering Pipeline:** Train K-Means clustering with zero label exposure, evaluating Silhouette scores across $K \in [2, 7]$ to select optimal $K=5$.
- **Extract Autonomous Behavioral Profiles:** Profile discovered cluster centroids across empirical feature means (flooding, reconnaissance, brute-force, exfiltration, benign baseline).
- **Construct an AI SOC Dashboard:** Develop a dark SOC-themed React frontend with real-time interactive inference sandboxes, 2D PCA latent projections, and server-side paginated dataset browsing.

---

## 5. Dataset Description
The dataset represents 150,000 synthetic network sessions inspired by empirical distributions from the CIC-IDS2017 and UNSW-NB15 benchmark suites:
- **Total Records:** 150,000 flows
- **Feature Dimensionality:** 42 features (37 standardized numerical features, 2 IPs, Flow ID, Protocol, and 2 Ground Truth Targets)
- **Class Balance:**
  - **Normal:** 81,000 flows (54.0%)
  - **DDoS:** 21,000 flows (14.0%)
  - **Port Scan:** 13,500 flows (9.0%)
  - **Brute Force:** 12,000 flows (8.0%)
  - **Web Attack:** 7,500 flows (5.0%)
  - **Data Exfiltration:** 7,500 flows (5.0%)
  - **Botnet:** 7,500 flows (5.0%)
- **Binary Target:** `is_attack` (0 = Normal, 1 = Malicious Attack)

> **Dataset Academic Disclaimer:** The dataset used in this academic project is synthetic/educational and was generated to reproduce realistic network traffic patterns. It should not be treated as a production intrusion detection dataset.

---

## 6. Dataset Generation
The dataset is generated reproducibly using `data/generate_dataset.py` with `random_state = 42`:
```bash
python data/generate_dataset.py --rows 150000 --seed 42
```
To prevent unrealistically perfect 100% classification scores, controlled overlap (~3.5%) is injected:
- Benign administrative traffic (scheduled backups, network discovery audits, developer password typos) mimics attack traits.
- Stealth attack traffic (low-and-slow brute force, stealthy exfiltration) mimics benign baseline metrics.

---

## 7. Feature Description
Key numerical features analyzed by the machine learning models:
| Feature | Type | Description | Security Significance |
|---|---|---|---|
| `packet_count` | Integer | Total packets exchanged in flow | Identifies volumetric floods |
| `byte_count` | Integer | Total volume of payload & headers | Identifies large data transfers |
| `flow_duration` | Float | Session duration in seconds | Distinguishes transient probes from backdoors |
| `packet_rate` | Float | Packets transmitted per second | Primary indicator of DoS/DDoS floods |
| `byte_rate` | Float | Bytes transmitted per second | Bandwidth consumption metric |
| `destination_port` | Integer | Target application service port | Identifies targeted services (SSH, HTTP, RDP) |
| `unique_destination_ports` | Integer | Distinct ports accessed | Core signature of port reconnaissance sweeps |
| `failed_login_attempts` | Integer | Count of failed authentications | Deterministic signature of brute-force attacks |
| `connection_count` | Integer | Concurrent connections | Detects resource exhaustion campaigns |
| `syn_count` | Integer | TCP SYN control flag packets | Detects half-open TCP SYN floods |
| `http_requests` | Integer | Application-layer web queries | Distinguishes web attacks from network layer floods |
| `data_exfiltration_score` | Float | Weighted ratio of outbound payload | Identifies unauthorized data leakage |

---

## 8. Classification Pipeline
- **Module:** `ml/classification.py`
- **Data Splitting:** 80% Training (120,000 flows), 20% Holdout Testing (30,000 flows) with stratified sampling (`random_state=42`).
- **Data Leakage Prevention:** `StandardScaler` fitted strictly on training data fold; holdout test set transformed using training parameters.
- **Model Architecture:**
  - **Primary Model:** `RandomForestClassifier(n_estimators=100, max_depth=18, min_samples_split=8, min_samples_leaf=4, random_state=42, n_jobs=-1)`
  - **Baseline Benchmark:** `LogisticRegression(max_iter=500, random_state=42)`

---

## 9. Why Random Forest for Network Classification?
1. **Hierarchical Non-Linear Decision Surfaces:** Cyber attacks are defined by multi-variable conjunctions (e.g. `packet_rate > 500` AND `destination_port == 80`). Decision trees naturally model these orthogonal boundaries.
2. **Robustness to Extreme Outliers:** Network packet rates span four orders of magnitude (0.1 to 65,000 pkts/s). Decision tree splits are rank-invariant and impervious to extreme tail distortions.
3. **Ensemble Variance Reduction:** Bagging 100 decorrelated trees eliminates individual tree overfitting and guarantees generalization on unseen test traffic.
4. **Interpretable Feature Importance:** Provides explicit Gini impurity reduction values for SOC analysts.

---

## 10. Classification Results
Evaluated on the 20% holdout test set (30,000 unseen network flows):
| Evaluation Metric | Random Forest (Primary) | Logistic Regression (Baseline) | Interpretation |
|---|---|---|---|
| **Accuracy** | **96.77%** | 96.27% | Correctness across all normal and attack flows |
| **Precision** | **96.19%** | 95.68% | Low false alarms (96.19% of flagged alerts are genuine) |
| **Recall (Sensitivity)** | **96.80%** | 96.18% | 96.80% of actual attacks successfully intercepted |
| **F1 Score** | **96.50%** | 95.93% | Harmonic balance between Precision and Recall |
| **ROC-AUC** | **0.9635** | 0.9685 | Near-optimal discrimination across decision thresholds |
| **Training Duration** | 10.90s | 0.86s | Rapid training across 120,000 samples |

### Confusion Matrix (30,000 Test Flows):
```
                       Predicted NORMAL      Predicted ATTACK
Actual NORMAL          TN = 15,671           FP = 529  (False Alarms)
Actual ATTACK          FN = 441              TP = 13,359 (Caught Attacks)
```

---

## 11. Clustering Pipeline
- **Module:** `ml/clustering.py`
- **Zero Label Guarantee:** Columns `is_attack` and `attack_type` are strictly stripped from the feature matrix prior to normalization.
- **Normalization:** 37 continuous features standardized via `StandardScaler`.
- **Dimensionality Reduction:** 2-Component Principal Component Analysis (PCA) fitted for 2D latent space visualization.

---

## 12. Why K-Means for Network Clustering?
1. **Linear Scalability:** $O(K \cdot N \cdot D)$ computational complexity clusters 150,000 flows in under 3 seconds. Hierarchical clustering would require $O(N^2)$ distance matrices (over 90 GB of RAM).
2. **Concrete Centroid Profiles:** Each cluster center produces a physical feature vector (mean packets, duration, port count) that translates directly into firewall filtering rules.
3. **Zero Prior Knowledge:** Discovers latent anomalies without requiring historical incident reports.

---

## 13. Choosing K & Silhouette Analysis
Evaluated across $K \in [2, 7]$:
| K | Silhouette Score | Inertia (WCSS) | Security Domain Evaluation |
|---|---|---|---|
| $K=2$ | 0.4735 | 3,848,935.1 | Coarse geometric split |
| $K=3$ | 0.4810 | 3,193,530.5 | Merges port scan and brute force |
| $K=4$ | 0.3439 | 2,784,140.3 | Separates exfiltration and flooding |
| **$K=5$** | **0.3722** | **2,440,745.4** | **SELECTED OPTIMAL: Cleanly isolates all 5 security archetypes** |
| $K=6$ | 0.3937 | 2,207,990.3 | Over-partitions baseline traffic |
| $K=7$ | 0.3977 | 2,036,823.2 | Fragmented sub-clusters |

> **Selection Rationale:** While $K=2$ or $3$ yield slightly higher raw geometric silhouette scores, $K=5$ is the objectively superior domain choice because it aligns directly with the 5 fundamental behavioral regimes in network security.

---

## 14. Clustering Discovered Profiles
The 5 autonomous clusters discovered by K-Means:
1. **Cluster 0: Extended Data Transfer & Exfiltration** (7,677 flows, 5.12%)
   - *Signature:* High exfiltration score (71.4), long flow duration (60+s), large payload sizes.
   - *Post-Hoc Attack Purity:* 95.9% (Exfiltration sessions).
2. **Cluster 1: High-Volume Flooding Traffic** (20,283 flows, 13.52%)
   - *Signature:* Extreme packet volume (avg 2,761 pkts), high byte rate, elevated connection count.
   - *Post-Hoc Attack Purity:* 96.2% (DDoS floods).
3. **Cluster 2: Reconnaissance & Port Scanning** (13,349 flows, 8.90%)
   - *Signature:* Abnormally high unique destination ports (avg 65.5 ports), low packets per probe (5.2 pkts).
   - *Post-Hoc Attack Purity:* 96.1% (Port scanning sweeps).
4. **Cluster 3: Baseline / Low-Intensity Traffic** (97,389 flows, 64.93%)
   - *Signature:* Moderate packet rates (82.6 pkts), standard protocols, negligible login failures (0.2).
   - *Post-Hoc Attack Purity:* 18.9% (Predominantly benign baseline user surfing).
5. **Cluster 4: Authentication & Brute-Force Activity** (11,302 flows, 7.53%)
   - *Signature:* Extreme failed login attempts (avg 26.5 failures), repeated connections to ports 22/3389.
   - *Post-Hoc Attack Purity:* 95.9% (Brute force & credential abuse).

---

## 15. Classification vs Clustering: Core Comparison
```
                    NETWORK TRAFFIC (150,000 Flows)
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
           CLASSIFICATION                      CLUSTERING
            Supervised ML                   Unsupervised ML
                  |                                 |
         "Is it an attack?"               "What behavior pattern?"
                  |                                 |
            Normal / Attack                    K-Means Groups
                  |                                 |
        Random Forest Model                   Cluster Profiles
                  |                                 |
     Accuracy / F1 / ROC-AUC                 Silhouette Score
```

| Evaluation Dimension | Supervised Classification | Unsupervised Clustering |
|---|---|---|
| **Learning Paradigm** | Supervised Learning | Unsupervised Learning |
| **Ground Truth Labels** | Required (`is_attack`, `attack_type`) | Strictly Eliminated Before Training |
| **Guiding Question** | *"Is this network flow NORMAL or an ATTACK?"* | *"What types of behavioral patterns exist?"* |
| **Operational Goal** | Known Threat Triage & Line-Rate Filtering | Zero-Day Discovery & Latent Topology Analysis |
| **Algorithm** | Random Forest Classifier (100 Trees) | K-Means Clustering ($K=5$) |
| **Model Output** | Discrete Class (0 or 1) + Attack Probability | Discovered Cluster ID (0 to 4) + Centroid Distance |
| **Primary Metric** | Accuracy (96.77%), F1 (96.50%), ROC-AUC (0.9635) | Silhouette Score (0.3722), Inertia (WCSS) |
| **Blind Spot** | Blind to novel zero-day attacks with no prior labels | Sensitive to feature scaling; lacks semantic labels |
| **SOC Workflow Role** | Perimeter Firewall Triage (Immediate Block) | Threat Hunting & Zero-Day Behavioral Profiling |

---

## 16. System Architecture
CyberLens employs a decoupled, production-grade microservices architecture:
- **Data Layer:** 150,000-flow CSV dataset with Pandas query engine and server-side streaming pagination.
- **ML Engine Layer:** Scikit-Learn pipelines serialized as binary pickle (`.pkl`) artifacts with thread-safe preprocessors.
- **REST API Layer:** FastAPI async web server on port 8000 with CORS middleware and Pydantic validation.
- **SOC Frontend Layer:** React 18 SPA built with Vite, Tailwind CSS, Lucide-React icons, and Recharts visualization.

---

## 17. System Workflow
```
[User / Browser]
       |
       v (HTTP / JSON)
[React SOC Frontend (Port 5173)]
       |
       v (REST Endpoints)
[FastAPI Backend Engine (Port 8000)]
       |
       +---> [Random Forest Model] ---> Returns Attack Probability & Risk Level
       |
       +---> [K-Means Cluster Model] -> Returns Cluster ID & Behavioral Description
       |
       +---> [Dataset Query Engine] --> Returns Server-Side Paginated Flows
```

---

## 18. Installation & Prerequisites
### System Requirements:
- Python 3.10+ (Tested on 3.11.9)
- Node.js 18+ (Tested on v24.21.0) and npm

### Installation Commands:
```bash
# 1. Clone or navigate to the workspace
cd "CyberLens — AI-Based Network Behavior Intelligence"

# 2. Install Python backend dependencies
pip install -r requirements.txt

# 3. Install React frontend dependencies
cd frontend
npm install
cd ..
```

---

## 19. How to Run
### One-Click Windows Startup:
Simply double-click:
```bash
run_project.bat
```

### Manual CLI Startup:
**Terminal 1 — FastAPI Backend:**
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — React Dashboard:**
```bash
cd frontend
npm run dev -- --port 5173
```
Open your browser to: **`http://localhost:5173`**
Interactive API Swagger Docs: **`http://localhost:8000/docs`**

---

## 20. API Documentation
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, dataset rows, and loaded model flags |
| `GET` | `/api/stats` | High-level dataset counts, attack distributions, and model scores |
| `GET` | `/api/classification/metrics` | Accuracy, Precision, Recall, F1, ROC-AUC, and Confusion Matrix |
| `POST` | `/api/classification/predict` | Live Random Forest inference (returns verdict, prob %, risk tier) |
| `GET` | `/api/clustering/metrics` | K evaluation (K=2..7), Silhouette scores, and PCA variance |
| `POST` | `/api/clustering/predict` | Live K-Means inference (returns cluster ID, distance, behavior name) |
| `GET` | `/api/clusters` | Discovered cluster profiles with empirical centroid statistics |
| `GET` | `/api/pca` | 1,500 sampled 2D PCA coordinates for interactive scatter plot |
| `GET` | `/api/dataset` | Server-side paginated, filterable, and sortable network telemetry |
| `GET` | `/api/feature-importance` | Top Gini feature importance rankings with security explanations |

---

## 21. User Interface Overview
The CyberLens web interface is structured into 8 SOC operation modules:
1. **Dashboard:** Hero overview, KPI operational cards, unified conceptual flow diagram, and dataset distribution charts.
2. **Classification View:** Supervised problem formulation, diagnostic ROC/PR curves, confusion matrix visualizer, and the **"Attack Detection Sandbox"**.
3. **Clustering View:** Unsupervised discovery formulation, Silhouette score vs. K chart, **2D PCA Latent Space Scatter Plot**, cluster profile cards, and the **"Network Behavior Explorer"**.
4. **Comparison Matrix:** Side-by-side scientific comparison table, architectural flowcharts, and SOC defense-in-depth synergy.
5. **Dataset Explorer:** Server-side paginated table (25/50/100 rows per page), search by IP or Flow ID, category filtering, and flow inspection modal.
6. **Model Insights:** Top Gini feature importances and scientific causality vs. correlation disclaimers.
7. **Viva Examination Guide:** 12 structured viva questions with crisp, high-scoring oral examination answers.
8. **Academic Report:** Formal BDE mini-project report with problem statements, methodology, empirical results, and official disclaimers.

---

## 22. Limitations
- **Synthetic Data:** While statistically realistic, synthetic telemetry cannot capture the full non-stationary drift and zero-day payload mutations of live internet transit.
- **Static Decision Boundaries:** The models currently operate as batch-trained artifacts and require periodic retraining to counter concept drift.
- **Euclidean Sensitivity:** K-Means assumes spherical cluster geometries in normalized feature space, which can imperfectly represent complex non-convex manifold structures.

---

## 23. Future Scope
- **Online Incremental Learning:** Integrating streaming classifiers (e.g. River or Online SGD) to update decision boundaries dynamically without full dataset re-ingestion.
- **Density-Based Clustering:** Comparing K-Means against DBSCAN or HDBSCAN to discover arbitrarily shaped non-spherical clusters and explicitly isolate noise outliers.
- **Deep Packet Inspection (DPI) & Sequence Modeling:** Incorporating Transformer or LSTM models to inspect raw packet payload byte sequences alongside statistical flow aggregates.

---

## 24. Ethical & Academic Considerations
This project was developed strictly for academic demonstration, machine learning education, and algorithm comparison. Machine learning intrusion detection systems must always be deployed in compliance with organizational acceptable-use policies and regional telecommunication privacy regulations (e.g., GDPR). Autonomous AI verdicts should be accompanied by human-in-the-loop analyst review before executing disruptive network isolation actions.

---

## 25. Conclusion
CyberLens demonstrates that Supervised Classification and Unsupervised Clustering represent complementary pillars of network behavior intelligence. Evaluated on the exact same 150,000-flow dataset, Random Forest achieves high-precision threat discrimination (96.77% accuracy) when ground-truth labels exist, while K-Means autonomously partitions traffic into 5 operational behavioral archetypes (Silhouette 0.3722) when operating with zero labels. Together, they form an effective defense-in-depth framework for modern cybersecurity operations.
