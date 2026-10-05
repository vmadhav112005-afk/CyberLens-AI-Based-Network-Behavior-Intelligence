import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { Eye, Info, Layers } from 'lucide-react';

const CLUSTER_COLORS = {
  0: "#06B6D4", // Cyan: Exfiltration
  1: "#EF4444", // Red: Flooding
  2: "#F59E0B", // Amber: Port Scanning
  3: "#10B981", // Emerald: Baseline
  4: "#8B5CF6", // Purple: Brute Force
};

const CLUSTER_LABELS = {
  0: "C0: Data Exfiltration (Cyan)",
  1: "C1: Volumetric Flooding (Red)",
  2: "C2: Recon & Port Scan (Amber)",
  3: "C3: Baseline Benign (Emerald)",
  4: "C4: Auth Brute-Force (Purple)",
};

const ATTACK_TYPE_COLORS = {
  "Normal": "#10B981",
  "DDoS": "#EF4444",
  "Port_Scan": "#F59E0B",
  "Brute_Force": "#8B5CF6",
  "Web_Attack": "#EC4899",
  "Data_Exfiltration": "#06B6D4",
  "Botnet": "#6366F1"
};

export default function PcaScatterPlot({ points = [], varianceExplained = [0.28, 0.19] }) {
  const [colorMode, setColorMode] = useState("cluster"); // 'cluster' or 'ground_truth'
  const [filterCluster, setFilterCluster] = useState("all");

  const filteredPoints = points.filter(p => {
    if (filterCluster === "all") return true;
    return p.cluster_id === parseInt(filterCluster);
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1 z-50">
          <div className="font-bold text-white flex items-center space-x-1.5 pb-1 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CLUSTER_COLORS[data.cluster_id] }}></span>
            <span>Cluster {data.cluster_id}</span>
            <span className="text-slate-400">({data.attack_type})</span>
          </div>
          <div className="text-slate-300">PC1: <span className="text-cyan-400">{data.x}</span> | PC2: <span className="text-cyan-400">{data.y}</span></div>
          <div className="text-slate-300">Packets: <span className="text-white">{data.packet_count.toLocaleString()}</span></div>
          <div className="text-slate-300">Bytes: <span className="text-white">{(data.byte_count / 1024).toFixed(1)} KB</span></div>
          <div className="text-slate-300">Protocol: <span className="text-indigo-400">{data.protocol}</span></div>
          <div className="text-[10px] text-slate-400 pt-1">
            Ground Truth: <span className={data.is_attack === 1 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{data.is_attack === 1 ? "Attack" : "Normal"}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="soc-card p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            Latent Topology
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>2D PCA Latent Space Projection (1,500 Sampled Flows)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Dimensionality reduction projecting 37 standardized features into 2 principal axes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Color Mode Switch */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setColorMode("cluster")}
              className={`px-2.5 py-1 rounded transition-all ${colorMode === "cluster" ? "bg-purple-600 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Color by Cluster
            </button>
            <button
              onClick={() => setColorMode("ground_truth")}
              className={`px-2.5 py-1 rounded transition-all ${colorMode === "ground_truth" ? "bg-purple-600 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
            >
              Color by Attack Type
            </button>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 font-mono focus:outline-none"
          >
            <option value="all">All Clusters (5)</option>
            <option value="0">Cluster 0 (Exfil)</option>
            <option value="1">Cluster 1 (Flooding)</option>
            <option value="2">Cluster 2 (Scanning)</option>
            <option value="3">Cluster 3 (Baseline)</option>
            <option value="4">Cluster 4 (Brute Force)</option>
          </select>
        </div>
      </div>

      {/* Visual Explanation Banner */}
      <div className="mb-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">How to read this plot:</strong> Each point represents a distinct network flow. Flows that exhibit similar behavioral telemetry are mapped closer together in latent space. K-Means grouped these points autonomously without ever seeing attack labels.
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <XAxis 
              type="number" 
              dataKey="x" 
              name="PC1" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              label={{ value: `Principal Component 1 (${((varianceExplained[0] || 0.28) * 100).toFixed(1)}% var)`, position: 'bottom', offset: 5, fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="PC2" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              label={{ value: `Principal Component 2 (${((varianceExplained[1] || 0.19) * 100).toFixed(1)}% var)`, angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
            />
            <ZAxis range={[25, 45]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Network Flows" data={filteredPoints} shape="circle">
              {filteredPoints.map((entry, index) => {
                const fill = colorMode === "cluster"
                  ? CLUSTER_COLORS[entry.cluster_id] || "#06B6D4"
                  : ATTACK_TYPE_COLORS[entry.attack_type] || "#64748B";
                return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.75} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
        {colorMode === "cluster" ? (
          Object.entries(CLUSTER_LABELS).map(([k, label]) => (
            <div key={k} className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CLUSTER_COLORS[k] }}></span>
              <span className="text-slate-300">{label}</span>
            </div>
          ))
        ) : (
          Object.entries(ATTACK_TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
              <span className="text-slate-300">{type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
