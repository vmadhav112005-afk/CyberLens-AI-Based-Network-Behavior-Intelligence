import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = "cyan", badge }) {
  const colorMap = {
    cyan: {
      border: "border-[#1E293B] hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-400",
      badge: "bg-sky-500/10 text-sky-300 border-sky-500/30"
    },
    emerald: {
      border: "border-[#1E293B] hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
    },
    purple: {
      border: "border-[#1E293B] hover:border-indigo-500/40",
      iconBg: "bg-indigo-500/10 text-indigo-400",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
    },
    amber: {
      border: "border-[#1E293B] hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/30"
    },
    rose: {
      border: "border-[#1E293B] hover:border-rose-500/40",
      iconBg: "bg-rose-500/10 text-rose-400",
      badge: "bg-rose-500/10 text-rose-300 border-rose-500/30"
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`soc-card p-5 border ${scheme.border} relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide">{title}</span>
        {badge && (
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${scheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.iconBg} transition-transform duration-200 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
