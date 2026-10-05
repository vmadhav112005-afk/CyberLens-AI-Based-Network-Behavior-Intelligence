import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  GitCompare, 
  Database, 
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'classification', label: 'Threat Classification', icon: ShieldCheck },
    { id: 'clustering', label: 'Behavioral Clustering', icon: Layers },
    { id: 'comparison', label: 'Comparison Matrix', icon: GitCompare },
    { id: 'dataset', label: 'Dataset Explorer', icon: Database },
  ];

  const currentTabLabel = navItems.find(item => item.id === activeTab)?.label || 'Overview';

  return (
    <header className="sticky top-0 z-50 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">
                CyberLens
              </span>
            </div>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <span className="text-slate-400">Security Operations</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-200 font-medium">{currentTabLabel}</span>
            </div>
          </div>

          {/* SOC Status Pill */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-[#111827] border border-[#1E293B]">
              {backendStatus ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-mono font-medium tracking-wide">SOC ACTIVE</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-mono text-[11px]">Healthy (150k Flows)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 font-mono font-medium">Connecting Backend...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-[#1E293B]/70 scrollbar-none text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800/90 text-white font-semibold shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
