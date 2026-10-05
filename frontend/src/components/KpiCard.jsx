import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = "cyan", badge }) {
  const colorMap = {
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      bg: "bg-cyan-500/10 text-cyan-400",
      glow: "shadow-cyan-500/5",
      badge: "bg-cyan-950/80 text-cyan-300 border-cyan-800"
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/50",
      bg: "bg-emerald-500/10 text-emerald-400",
      glow: "shadow-emerald-500/5",
      badge: "bg-emerald-950/80 text-emerald-300 border-emerald-800"
    },
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/50",
      bg: "bg-purple-500/10 text-purple-400",
      glow: "shadow-purple-500/5",
      badge: "bg-purple-950/80 text-purple-300 border-purple-800"
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/50",
      bg: "bg-amber-500/10 text-amber-400",
      glow: "shadow-amber-500/5",
      badge: "bg-amber-950/80 text-amber-300 border-amber-800"
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/50",
      bg: "bg-rose-500/10 text-rose-400",
      glow: "shadow-rose-500/5",
      badge: "bg-rose-950/80 text-rose-300 border-rose-800"
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`soc-card p-5 transition-all duration-200 border ${scheme.border} shadow-lg ${scheme.glow} relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.bg} transition-transform duration-200 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {badge && (
          <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full border ${scheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400 flex items-center space-x-1">
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
}
