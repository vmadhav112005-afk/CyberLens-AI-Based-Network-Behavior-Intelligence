import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Info, 
  Download,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { fetchDataset } from '../services/api';

const ATTACK_TYPES = [
  "All",
  "Normal",
  "DDoS",
  "Port_Scan",
  "Brute_Force",
  "Web_Attack",
  "Data_Exfiltration",
  "Botnet"
];

export default function DatasetExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [attackTypeFilter, setAttackTypeFilter] = useState("All");
  const [isAttackFilter, setIsAttackFilter] = useState("");
  const [sortBy, setSortBy] = useState("flow_id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Selected row for detail drawer
  const [selectedRow, setSelectedRow] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDataset({
        page,
        limit,
        attackType: attackTypeFilter,
        isAttack: isAttackFilter === "" ? null : parseInt(isAttackFilter),
        search: searchTerm,
        sortBy,
        sortOrder
      });
      setData(res.items || []);
      setTotalRecords(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error("Failed to load dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, attackTypeFilter, isAttackFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>SERVER-SIDE PAGINATION ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Network Traffic Dataset Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Browsing 150,000 synthetic network telemetry flows with live filtering and deep flow inspection.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono block">Matching Records</span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {totalRecords.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="soc-card p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search Flow ID, Source IP, Dest IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Attack Type Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Category:</span>
            <select
              value={attackTypeFilter}
              onChange={(e) => { setAttackTypeFilter(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              {ATTACK_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Is Attack Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Label:</span>
            <select
              value={isAttackFilter}
              onChange={(e) => { setIsAttackFilter(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="">All (0 & 1)</option>
              <option value="0">0: Normal Only</option>
              <option value="1">1: Attack Only</option>
            </select>
          </div>

          {/* Page Limit */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Rows:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="soc-card border border-slate-800 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-10 font-mono text-cyan-400 text-xs">
            Querying telemetry database...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 select-none">
                <th onClick={() => handleSort("flow_id")} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Flow ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Dest IP:Port</th>
                <th className="py-3 px-4">Proto</th>
                <th onClick={() => handleSort("packet_count")} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Packets</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort("byte_count")} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Bytes</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort("packet_rate")} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center space-x-1">
                    <span>Rate (p/s)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Failed Logins</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.map((row) => (
                <tr
                  key={row.flow_id}
                  onClick={() => setSelectedRow(row)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-cyan-400">{row.flow_id}</td>
                  <td className="py-3 px-4 text-slate-300">{row.source_ip}</td>
                  <td className="py-3 px-4 text-slate-300">{row.destination_ip}:{row.destination_port}</td>
                  <td className="py-3 px-4 text-slate-400 font-semibold">{row.protocol}</td>
                  <td className="py-3 px-4 text-white font-medium">{row.packet_count.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-300">{(row.byte_count / 1024).toFixed(1)} KB</td>
                  <td className="py-3 px-4 text-slate-300">{row.packet_rate}</td>
                  <td className="py-3 px-4 text-center font-bold text-purple-300">{row.failed_login_attempts}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{
                      backgroundColor: row.attack_type === "Normal" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: row.attack_type === "Normal" ? "#10B981" : "#F87171",
                      border: `1px solid ${row.attack_type === "Normal" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
                    }}>
                      {row.attack_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.is_attack === 0 ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"}`}>
                      {row.is_attack === 0 ? "0 (Normal)" : "1 (Attack)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Showing Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages.toLocaleString()}</strong> ({totalRecords.toLocaleString()} Total)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            >
              First
            </button>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded bg-slate-800/80 text-cyan-400 font-bold">
              {page}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Row Details Modal / Drawer */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="soc-card p-6 border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Flow Telemetry Record</span>
                <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
                  <span>{selectedRow.flow_id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${selectedRow.is_attack === 1 ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"}`}>
                    {selectedRow.attack_type}
                  </span>
                </h3>
              </div>
              <button onClick={() => setSelectedRow(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Source IP:Port</span>
                <span className="text-white font-bold">{selectedRow.source_ip}:{selectedRow.source_port}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Destination IP:Port</span>
                <span className="text-white font-bold">{selectedRow.destination_ip}:{selectedRow.destination_port}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Protocol</span>
                <span className="text-cyan-400 font-bold">{selectedRow.protocol}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Flow Duration</span>
                <span className="text-white font-bold">{selectedRow.flow_duration}s</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total Packets</span>
                <span className="text-white font-bold">{selectedRow.packet_count?.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total Bytes</span>
                <span className="text-white font-bold">{selectedRow.byte_count?.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Packet Rate</span>
                <span className="text-white font-bold">{selectedRow.packet_rate} p/s</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Unique Dest Ports</span>
                <span className="text-amber-400 font-bold">{selectedRow.unique_destination_ports}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Failed Logins</span>
                <span className="text-purple-400 font-bold">{selectedRow.failed_login_attempts}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Data Exfiltration Score</span>
                <span className="text-rose-400 font-bold">{selectedRow.data_exfiltration_score}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TCP SYN Count</span>
                <span className="text-white font-bold">{selectedRow.syn_count || 0}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Connection Count</span>
                <span className="text-white font-bold">{selectedRow.connection_count}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRow(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
