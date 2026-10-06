import json
import matplotlib.pyplot as plt
import numpy as np

# Load clustering results
with open('results/clustering_results.json', 'r') as f:
    data = json.load(f)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# ==============================================================================
# BOX 1: SILHOUETTE vs K (K=2-7) + CHOSEN K + FINAL SCORE
# ==============================================================================
fig, ax = plt.subplots(figsize=(6.2, 4.2), dpi=300)
fig.patch.set_facecolor('#FFFFFF')
ax.set_facecolor('#FAFAFA')

k_eval = data['k_evaluation']
k_vals = [item['k'] for item in k_eval]
sil_scores = [item['silhouette_score'] for item in k_eval]

ax.plot(k_vals, sil_scores, color='#2563EB', marker='o', markersize=7, linewidth=2.5, label='Silhouette Score')

# Highlight K=5
k5_score = data['best_silhouette_score']
ax.scatter([5], [k5_score], color='#DC2626', s=140, zorder=5, edgecolors='black', linewidth=1.5)

# Annotation for K=5
ax.annotate(
    f'Chosen K = 5\nScore = {k5_score:.4f}',
    xy=(5, k5_score),
    xytext=(5.3, k5_score + 0.05),
    arrowprops=dict(facecolor='#DC2626', shrink=0.08, width=1.5, headwidth=6),
    fontsize=10.5,
    fontweight='bold',
    color='#991B1B',
    bbox=dict(boxstyle='round,pad=0.4', facecolor='#FEE2E2', edgecolor='#EF4444', alpha=0.95)
)

ax.set_title('Silhouette Analysis across K ∈ [2, 7]', fontsize=13, fontweight='bold', pad=12, color='#1E293B')
ax.set_xlabel('Number of Clusters (K)', fontsize=11, fontweight='semibold', color='#334155')
ax.set_ylabel('Silhouette Score', fontsize=11, fontweight='semibold', color='#334155')
ax.set_ylim(0.28, 0.55)
ax.set_xticks(k_vals)
ax.grid(True, linestyle='--', alpha=0.5, color='#CBD5E1')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#94A3B8')
ax.spines['bottom'].set_color('#94A3B8')

plt.tight_layout()
plt.savefig('results/slide_assets/box1_silhouette_vs_k.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()
print("Saved box1_silhouette_vs_k.png")


# ==============================================================================
# BOX 2: PCA 2D CLUSTER PLOT
# ==============================================================================
fig, ax = plt.subplots(figsize=(6.2, 5.0), dpi=300)
fig.patch.set_facecolor('#FFFFFF')
ax.set_facecolor('#FAFAFA')

pts = data['pca_visualization_sample']
clusters = [p['cluster_id'] for p in pts]
xs = [p['x'] for p in pts]
ys = [p['y'] for p in pts]

cluster_meta = {
    0: ('#2563EB', 'C0: Exfiltration Risk'),
    1: ('#DC2626', 'C1: Volumetric Flooding'),
    2: ('#EA580C', 'C2: Port Scanning'),
    3: ('#16A34A', 'C3: Benign Baseline'),
    4: ('#9333EA', 'C4: Credential Abuse')
}

for cid in sorted(cluster_meta.keys()):
    cx = [xs[i] for i, c in enumerate(clusters) if c == cid]
    cy = [ys[i] for i, c in enumerate(clusters) if c == cid]
    col, label = cluster_meta[cid]
    ax.scatter(cx, cy, c=col, s=22, alpha=0.75, edgecolors='none', label=label)

# Plot Centroids
for cid in sorted(cluster_meta.keys()):
    cx = np.mean([xs[i] for i, c in enumerate(clusters) if c == cid])
    cy = np.mean([ys[i] for i, c in enumerate(clusters) if c == cid])
    ax.scatter(cx, cy, c='black', s=90, marker='X', edgecolors='white', linewidth=1.2, zorder=6)

ax.set_title('2D PCA Latent Space Projection (K=5)', fontsize=13, fontweight='bold', pad=12, color='#1E293B')
ax.set_xlabel('Principal Component 1 (32.6% Var)', fontsize=10.5, fontweight='semibold', color='#334155')
ax.set_ylabel('Principal Component 2 (15.0% Var)', fontsize=10.5, fontweight='semibold', color='#334155')
ax.grid(True, linestyle='--', alpha=0.5, color='#CBD5E1')
ax.legend(loc='upper right', fontsize=8.5, framealpha=0.95, edgecolor='#CBD5E1')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#94A3B8')
ax.spines['bottom'].set_color('#94A3B8')

plt.tight_layout()
plt.savefig('results/slide_assets/box2_pca_2d_cluster_plot.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()
print("Saved box2_pca_2d_cluster_plot.png")


# ==============================================================================
# BOX 3: CLUSTER SIZES & PROFILES TABLE
# ==============================================================================
fig, ax = plt.subplots(figsize=(7.5, 4.2), dpi=300)
fig.patch.set_facecolor('#FFFFFF')
ax.axis('off')

table_data = [
    ["Cluster ID", "Discovered Behavioral Profile", "Flows", "Share (%)", "Dominant Trait"],
    ["Cluster 0", "Data Exfiltration Risk", "7,677", "5.1%", "High bytes, Long duration (78s)"],
    ["Cluster 1", "Volumetric Flooding / DDoS", "20,283", "13.5%", "High packet rate (2,724 pkts/s)"],
    ["Cluster 2", "Port Scanning / Reconnaissance", "13,349", "8.9%", "High unique ports (65.5 avg)"],
    ["Cluster 3", "Benign Baseline Traffic", "97,389", "64.9%", "Normal rate, Standard ports"],
    ["Cluster 4", "Authentication / Brute Force", "11,302", "7.5%", "High failed logins (26.5 avg)"]
]

col_widths = [0.15, 0.32, 0.12, 0.12, 0.29]
tab = ax.table(
    cellText=table_data,
    colWidths=col_widths,
    cellLoc='center',
    loc='center'
)

tab.auto_set_font_size(False)
tab.set_fontsize(9.5)
tab.scale(1.0, 1.85)

# Styling table cells
for (row, col), cell in tab.get_celld().items():
    cell.set_edgecolor('#CBD5E1')
    cell.set_linewidth(1.0)
    if row == 0:
        cell.set_facecolor('#1E293B')
        cell.get_text().set_color('#FFFFFF')
        cell.get_text().set_weight('bold')
    else:
        if row % 2 == 1:
            cell.set_facecolor('#F8FAFC')
        else:
            cell.set_facecolor('#FFFFFF')
        if col == 0:
            cell.get_text().set_weight('bold')
            # color accents
            colors = ['#2563EB', '#DC2626', '#EA580C', '#16A34A', '#9333EA']
            cell.get_text().set_color(colors[row-1])
        elif col == 1:
            cell.get_text().set_weight('semibold')
            cell.get_text().set_color('#0F172A')
        else:
            cell.get_text().set_color('#334155')

plt.title('Autonomous Behavioral Cluster Profiles (150k Flows, K=5)', fontsize=12, fontweight='bold', pad=8, color='#1E293B')
plt.tight_layout()
plt.savefig('results/slide_assets/box3_cluster_profiles_table.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()
print("Saved box3_cluster_profiles_table.png")
