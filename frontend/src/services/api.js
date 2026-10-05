/**
 * CyberLens — Frontend API Client
 * Connects React frontend directly to FastAPI backend endpoints.
 */

const API_BASE = "http://localhost:8000/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend offline");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to load system stats");
  return res.json();
}

export async function fetchClassificationMetrics() {
  const res = await fetch(`${API_BASE}/classification/metrics`);
  if (!res.ok) throw new Error("Failed to load classification metrics");
  return res.json();
}

export async function predictClassification(payload) {
  const res = await fetch(`${API_BASE}/classification/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Classification prediction failed");
  return res.json();
}

export async function fetchClusteringMetrics() {
  const res = await fetch(`${API_BASE}/clustering/metrics`);
  if (!res.ok) throw new Error("Failed to load clustering metrics");
  return res.json();
}

export async function predictClustering(payload) {
  const res = await fetch(`${API_BASE}/clustering/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Clustering prediction failed");
  return res.json();
}

export async function fetchClusters() {
  const res = await fetch(`${API_BASE}/clusters`);
  if (!res.ok) throw new Error("Failed to load clusters");
  return res.json();
}

export async function fetchPcaPoints() {
  const res = await fetch(`${API_BASE}/pca`);
  if (!res.ok) throw new Error("Failed to load PCA coordinates");
  return res.json();
}

export async function fetchDataset({ page = 1, limit = 25, attackType = "", isAttack = null, search = "", sortBy = "flow_id", sortOrder = "asc" }) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (attackType && attackType !== "All") params.append("attack_type", attackType);
  if (isAttack !== null && isAttack !== undefined && isAttack !== "") params.append("is_attack", isAttack);
  if (search) params.append("search", search);
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);

  const res = await fetch(`${API_BASE}/dataset?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load dataset rows");
  return res.json();
}

export async function fetchFeatureImportance() {
  const res = await fetch(`${API_BASE}/feature-importance`);
  if (!res.ok) throw new Error("Failed to load feature importance");
  return res.json();
}
