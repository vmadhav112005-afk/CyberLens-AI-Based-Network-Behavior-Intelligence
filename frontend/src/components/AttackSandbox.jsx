import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal 
} from 'lucide-react';
import { predictClassification } from '../services/api';

const PRESETS = {
  normal: {
    label: "Normal Web Browsing",
    values: {
      packet_count: 45,
      byte_count: 24500,
      flow_duration: 8.5,
      packet_rate: 5.29,
      byte_rate: 2882.35,
      destination_port: 443,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 3,
      syn_count: 1,
      http_requests: 0,
      data_exfiltration_score: 2.1
    }
  },
  ddos: {
    label: "DDoS Volumetric Burst",
    values: {
      packet_count: 2800,
      byte_count: 2660000,
      flow_duration: 3.2,
      packet_rate: 875.0,
      byte_rate: 831250.0,
      destination_port: 80,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 120,
      syn_count: 65,
      http_requests: 35,
      data_exfiltration_score: 3.5
    }
  },
  portscan: {
    label: "Port Scanning Sweep",
    values: {
      packet_count: 4,
      byte_count: 272,
      flow_duration: 0.15,
      packet_rate: 26.6,
      byte_rate: 1813.3,
      destination_port: 8080,
      unique_destination_ports: 85,
      failed_login_attempts: 0,
      connection_count: 40,
      syn_count: 4,
      http_requests: 0,
      data_exfiltration_score: 0.8
    }
  },
  bruteforce: {
    label: "SSH/RDP Brute Force",
    values: {
      packet_count: 65,
      byte_count: 18200,
      flow_duration: 14.0,
      packet_rate: 4.64,
      byte_rate: 1300.0,
      destination_port: 22,
      unique_destination_ports: 1,
      failed_login_attempts: 28,
      connection_count: 22,
      syn_count: 8,
      http_requests: 0,
      data_exfiltration_score: 2.0
    }
  },
  exfil: {
    label: "Data Exfiltration Session",
    values: {
      packet_count: 420,
      byte_count: 615000,
      flow_duration: 75.0,
      packet_rate: 5.6,
      byte_rate: 8200.0,
      destination_port: 443,
      unique_destination_ports: 1,
      failed_login_attempts: 0,
      connection_count: 2,
      syn_count: 2,
      http_requests: 4,
      data_exfiltration_score: 88.5
    }
  }
};

export default function AttackSandbox() {
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

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictClassification(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to reach inference server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="soc-card p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Real-Time Inference Engine
          </span>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Attack Detection Sandbox</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tweak network telemetry parameters and test against the live trained Random Forest classifier.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Presets:
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

      <form onSubmit={handleAnalyze}>
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Packet Count</label>
            <input
              type="number"
              step="any"
              name="packet_count"
              value={formData.packet_count}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Byte Rate (B/s)</label>
            <input
              type="number"
              step="any"
              name="byte_rate"
              value={formData.byte_rate}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">TCP SYN Count</label>
            <input
              type="number"
              step="1"
              name="syn_count"
              value={formData.syn_count}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">HTTP Requests</label>
            <input
              type="number"
              step="1"
              name="http_requests"
              value={formData.http_requests}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit & Reset Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Analyzing Flow...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Traffic</span>
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

      {/* Live Inference Output */}
      {result && (
        <div className="mt-6 p-5 rounded-xl border transition-all animate-fadeIn" style={{ borderColor: result.risk_color, backgroundColor: `${result.risk_color}10` }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                Random Forest Verdict
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-0.5 flex items-center space-x-2">
                {result.is_attack === 1 ? (
                  <>
                    <AlertOctagon className="w-6 h-6 text-rose-500 animate-pulse" />
                    <span className="text-rose-400">{result.prediction}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span className="text-emerald-400">{result.prediction}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-mono">Attack Probability</span>
                <div className="text-xl font-bold font-mono text-white">
                  {result.attack_probability}%
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-mono">Risk Level</span>
                <div>
                  <span 
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase"
                    style={{ backgroundColor: `${result.risk_color}30`, color: result.risk_color, border: `1px solid ${result.risk_color}` }}
                  >
                    {result.risk_level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Model Decision Indicators:</span>
            </span>
            <ul className="space-y-1">
              {result.contributing_factors.map((factor, idx) => (
                <li key={idx} className="text-xs text-slate-300 font-mono flex items-start space-x-2">
                  <span className="text-cyan-400">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
