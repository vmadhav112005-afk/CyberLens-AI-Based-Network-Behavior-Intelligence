import React, { useState } from 'react';
import { 
  Compass, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { predictClustering } from '../services/api';

const PRESETS = {
  normal: {
    label: "Normal Flow Pattern",
    values: {
      packet_count: 50,
      byte_count: 28000,
      flow_duration: 9.0,
      packet_rate: 5.5,
      destination_port: 443,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 3,
      http_requests: 1,
      data_exfiltration_score: 2.5
    }
  },
  flood: {
    label: "Volumetric Flood Pattern",
    values: {
      packet_count: 3200,
      byte_count: 3100000,
      flow_duration: 3.0,
      packet_rate: 1066.6,
      destination_port: 80,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 140,
      http_requests: 40,
      data_exfiltration_score: 3.0
    }
  },
  scan: {
    label: "Multi-Port Probe Pattern",
    values: {
      packet_count: 5,
      byte_count: 350,
      flow_duration: 0.12,
      packet_rate: 41.6,
      destination_port: 445,
      unique_destination_ports: 75,
      failed_login_attempts: 0,
      connection_count: 35,
      http_requests: 0,
      data_exfiltration_score: 0.5
    }
  },
  auth: {
    label: "Credential Abuse Pattern",
    values: {
      packet_count: 70,
      byte_count: 19500,
      flow_duration: 16.0,
      packet_rate: 4.37,
      destination_port: 22,
      unique_destination_ports: 1,
      failed_login_attempts: 32,
      connection_count: 24,
      http_requests: 0,
      data_exfiltration_score: 1.8
    }
  },
  exfil: {
    label: "Heavy Outbound Upload",
    values: {
      packet_count: 500,
      byte_count: 720000,
      flow_duration: 80.0,
      packet_rate: 6.25,
      destination_port: 443,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 2,
      http_requests: 5,
      data_exfiltration_score: 89.0
    }
  }
};

export default function BehaviorExplorer() {
  const [formData, setFormData] = useState(PRESETS.normal.values);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const applyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].values);
    setResult(null);
  };

  const handleExplore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictClustering(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to query clustering model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="soc-card p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            Unsupervised Discovery
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <span>Network Behavior Explorer</span>
          </h3>
          <p className="text-xs text-slate-400">
            Input traffic metrics to determine which discovered behavioral topology cluster this flow belongs to (zero labels).
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Patterns:
          </span>
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white transition-all font-mono"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleExplore}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Packet Count</label>
            <input
              type="number"
              step="any"
              name="packet_count"
              value={formData.packet_count}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Byte Count</label>
            <input
              type="number"
              step="any"
              name="byte_count"
              value={formData.byte_count}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Flow Duration (sec)</label>
            <input
              type="number"
              step="any"
              name="flow_duration"
              value={formData.flow_duration}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Packet Rate (pkts/s)</label>
            <input
              type="number"
              step="any"
              name="packet_rate"
              value={formData.packet_rate}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Destination Port</label>
            <input
              type="number"
              step="1"
              name="destination_port"
              value={formData.destination_port}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Unique Dest Ports</label>
            <input
              type="number"
              step="1"
              name="unique_destination_ports"
              value={formData.unique_destination_ports}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Failed Login Attempts</label>
            <input
              type="number"
              step="1"
              name="failed_login_attempts"
              value={formData.failed_login_attempts}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Connection Count</label>
            <input
              type="number"
              step="1"
              name="connection_count"
              value={formData.connection_count}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Data Exfiltration Score</label>
            <input
              type="number"
              step="any"
              name="data_exfiltration_score"
              value={formData.data_exfiltration_score}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Mapping to Latent Space...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Find Behavior</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Cluster Prediction Result */}
      {result && (
        <div className="mt-6 p-5 rounded-xl border transition-all animate-fadeIn" style={{ borderColor: result.color, backgroundColor: `${result.color}10` }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                  Cluster Assignment
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${result.color}25`, color: result.color, border: `1px solid ${result.color}50` }}>
                  CLUSTER {result.cluster_id}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-1 text-white">
                {result.cluster_name}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-mono">Centroid Distance</span>
                <div className="text-xl font-bold font-mono text-white">
                  {result.distance_to_center.toFixed(4)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-mono">Post-Hoc Attack Ratio</span>
                <div className="text-xl font-bold font-mono" style={{ color: result.color }}>
                  {result.post_hoc_attack_pct}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-300 block mb-1">
              Autonomous Behavioral Profile Description:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
