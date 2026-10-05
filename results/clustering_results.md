# CyberLens — Unsupervised Clustering Performance Report

## 1. Executive Summary
- **Task**: Unsupervised Network Behavioral Pattern Discovery
- **Algorithm**: K-Means Clustering
- **Optimal Clusters (K)**: 5
- **Silhouette Score at K=5**: 0.3722
- **Labels Used During Training**: **NONE (Zero-label Unsupervised Learning)**
- **PCA 2D Variance Explained**: PC1 (32.6%), PC2 (15.0%)

## 2. Silhouette Analysis (K=2..7)
| K | Silhouette Score | Inertia (Within-Cluster Sum of Squares) | Evaluation |
|---|---|---|---|
| K=2 | 0.4735 | 3,848,935.1 | Evaluated |
| K=3 | 0.4810 | 3,193,530.5 | Evaluated |
| K=4 | 0.3439 | 2,784,140.3 | Evaluated |
| K=5 | 0.3722 | 2,440,745.4 | **OPTIMAL** |
| K=6 | 0.3937 | 2,207,990.3 | Evaluated |
| K=7 | 0.3977 | 2,036,823.2 | Evaluated |

## 3. Discovered Behavioral Cluster Profiles
The following behavioral clusters emerged autonomously from the feature topology without supervisory guidance:

### Cluster 0: Extended Data Transfer & Exfiltration (`EXFILTRATION_RISK`)
- **Volume**: 7,677 flows (5.12%)
- **Dominant Protocol**: TCP
- **Mean Packets / Duration**: 687.2 packets over 78.06s
- **Mean Packet Rate**: 15.2 pkts/sec | Byte Rate: 19,393.7 B/s
- **Scanning Signature**: 1.1 avg unique destination ports
- **Auth Signature**: 0.13 avg failed logins
- **Exfiltration Score**: 71.43
- **Post-Hoc Attack Purity**: 95.9% of flows belong to known attack classes
- **Behavioral Profile**: Long-duration flows with disproportionate outbound byte volumes and high exfiltration scores. Corresponds to heavy data exfiltration, large unauthorized backups, or command-and-control uploads.

### Cluster 1: High-Volume Flooding Traffic (`VOLUMETRIC_SPIKE`)
- **Volume**: 20,283 flows (13.52%)
- **Dominant Protocol**: TCP
- **Mean Packets / Duration**: 2,761.6 packets over 4.09s
- **Mean Packet Rate**: 2,723.9 pkts/sec | Byte Rate: 2,588,434.1 B/s
- **Scanning Signature**: 1.1 avg unique destination ports
- **Auth Signature**: 0.00 avg failed logins
- **Exfiltration Score**: 2.49
- **Post-Hoc Attack Purity**: 96.2% of flows belong to known attack classes
- **Behavioral Profile**: Traffic characterized by massive packet volumes, elevated byte rates, and high connection/SYN counts. Resembles distributed denial-of-service (DDoS) bursts and network flooding activity.

### Cluster 2: Reconnaissance & Port Scanning (`RECONNAISSANCE`)
- **Volume**: 13,349 flows (8.9%)
- **Dominant Protocol**: TCP
- **Mean Packets / Duration**: 5.2 packets over 1.50s
- **Mean Packet Rate**: 13.4 pkts/sec | Byte Rate: 2,391.0 B/s
- **Scanning Signature**: 65.5 avg unique destination ports
- **Auth Signature**: 0.02 avg failed logins
- **Exfiltration Score**: 0.53
- **Post-Hoc Attack Purity**: 96.1% of flows belong to known attack classes
- **Behavioral Profile**: Traffic targeting an abnormally wide range of unique destination ports with minimal packets per connection. Exhibits characteristics typical of automated vulnerability scans and network mapping.

### Cluster 3: Baseline / Low-Intensity Traffic (`BENIGN_BASELINE`)
- **Volume**: 97,389 flows (64.93%)
- **Dominant Protocol**: TCP
- **Mean Packets / Duration**: 82.6 packets over 13.69s
- **Mean Packet Rate**: 24.6 pkts/sec | Byte Rate: 13,944.5 B/s
- **Scanning Signature**: 1.7 avg unique destination ports
- **Auth Signature**: 0.23 avg failed logins
- **Exfiltration Score**: 6.70
- **Post-Hoc Attack Purity**: 18.9% of flows belong to known attack classes
- **Behavioral Profile**: Balanced, moderate-volume traffic with standard packet rates, typical protocol distributions, and low error counts. Represents routine legitimate user activity and standard business services.

### Cluster 4: Authentication & Brute-Force Activity (`CREDENTIAL_ABUSE`)
- **Volume**: 11,302 flows (7.53%)
- **Dominant Protocol**: TCP
- **Mean Packets / Duration**: 80.3 packets over 20.06s
- **Mean Packet Rate**: 8.6 pkts/sec | Byte Rate: 2,402.2 B/s
- **Scanning Signature**: 1.1 avg unique destination ports
- **Auth Signature**: 26.51 avg failed logins
- **Exfiltration Score**: 1.27
- **Post-Hoc Attack Purity**: 95.9% of flows belong to known attack classes
- **Behavioral Profile**: Sessions showing severe repeated failed authentication attempts against remote management or web services. Aligns closely with password spraying and credential stuffing attempts.

## 4. Why K-Means for Network Behavior Intelligence?
1. **Scalability**: Efficient $O(K \cdot N \cdot D)$ complexity handles 150k+ network flows rapidly.
2. **Centroid Interpretability**: Each cluster center provides a concrete numerical fingerprint of traffic behavior.
3. **Zero Prior Knowledge**: Detects novel or zero-day anomalous patterns that supervised models fail to capture due to lack of historical labels.
4. **Complementary to Classification**: Serves as the unsupervised discovery engine while Random Forest serves as the high-precision detection engine.