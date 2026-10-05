import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ConfusionMatrix({ matrix, totalTestSamples = 30000 }) {
  if (!matrix) {
    return <div className="p-4 text-center text-slate-500 font-mono text-xs">Awaiting Matrix Data...</div>;
  }

  const { true_negative, false_positive, false_negative, true_positive } = matrix;
  const tn = true_negative || 0;
  const fp = false_positive || 0;
  const fn = false_negative || 0;
  const tp = true_positive || 0;
  const total = tn + fp + fn + tp || totalTestSamples;

  const tn_pct = ((tn / total) * 100).toFixed(1);
  const fp_pct = ((fp / total) * 100).toFixed(1);
  const fn_pct = ((fn / total) * 100).toFixed(1);
  const tp_pct = ((tp / total) * 100).toFixed(1);

  return (
    <div className="soc-card p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Confusion Matrix (20% Holdout Test Set)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical validation on {total.toLocaleString()} unseen network flows.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            Real Evaluated Holdout
          </span>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* True Negative */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>True Negative (TN)</span>
            </span>
            <span className="font-mono text-emerald-400">{tn_pct}%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {tn.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Actual: <strong className="text-emerald-300">Normal</strong> → Predicted: <strong className="text-emerald-300">Normal</strong>
          </p>
          <span className="text-[10px] text-emerald-400/80 block mt-1">Legitimate traffic verified</span>
        </div>

        {/* False Positive */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
            <span className="flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>False Positive (FP)</span>
            </span>
            <span className="font-mono text-amber-400">{fp_pct}%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-200">
            {fp.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Actual: <strong className="text-slate-300">Normal</strong> → Predicted: <strong className="text-rose-400">Attack</strong>
          </p>
          <span className="text-[10px] text-amber-400/80 block mt-1">False Alarms (heavy backup/scans)</span>
        </div>

        {/* False Negative */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold mb-2">
            <span className="flex items-center space-x-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>False Negative (FN)</span>
            </span>
            <span className="font-mono text-rose-400">{fn_pct}%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-300">
            {fn.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Actual: <strong className="text-rose-400">Attack</strong> → Predicted: <strong className="text-emerald-300">Normal</strong>
          </p>
          <span className="text-[10px] text-rose-400/80 block mt-1">Missed Threats (stealth evasion)</span>
        </div>

        {/* True Positive */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold mb-2">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>True Positive (TP)</span>
            </span>
            <span className="font-mono text-cyan-400">{tp_pct}%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {tp.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Actual: <strong className="text-rose-400">Attack</strong> → Predicted: <strong className="text-rose-400">Attack</strong>
          </p>
          <span className="text-[10px] text-cyan-400/80 block mt-1">Attacks successfully intercepted</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span>Specificity (True Negative Rate): </span>
          <strong className="text-emerald-400 font-mono">{((tn / (tn + fp)) * 100).toFixed(2)}%</strong>
        </div>
        <div>
          <span>Sensitivity (Recall / True Positive Rate): </span>
          <strong className="text-cyan-400 font-mono">{((tp / (tp + fn)) * 100).toFixed(2)}%</strong>
        </div>
        <div>
          <span>Precision (Positive Predictive Value): </span>
          <strong className="text-indigo-400 font-mono">{((tp / (tp + fp)) * 100).toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
}
