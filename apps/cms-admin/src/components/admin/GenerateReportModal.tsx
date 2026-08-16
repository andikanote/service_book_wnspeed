import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle2, Calendar, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'financial' | 'inventory' | 'csat' | 'operations'>('financial');
  const [dateRange, setDateRange] = useState('month');
  const [branch, setBranch] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 700);
  };

  const handleDownload = () => {
    const reportData = `ART N SPEED - PRECISION WORKSHOP REPORT\nType: ${reportType.toUpperCase()}\nDate: ${new Date().toLocaleDateString()}\nBranch: ${branch}\nTotal Revenue: Rp 142,500,000\nActive Bookings: 48\nCSAT Rating: 4.9/5.0\nCritical Items: V-Belts (2 units), Brake Pads (3 units)`;
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ART_N_SPEED_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-mono uppercase tracking-wider">Generate Workshop Report</h3>
              <p className="text-xs text-slate-500">ART N SPEED Analytics & Intelligence Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-600 uppercase font-semibold mb-2">Select Report Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'financial', label: 'Financial & Revenue', icon: TrendingUp, metric: 'Rp 142.5M' },
                { id: 'inventory', label: 'Low Stock Alert', icon: AlertTriangle, metric: '12 Items' },
                { id: 'csat', label: 'CSAT & Quality', icon: Star, metric: '4.9 / 5.0' },
                { id: 'operations', label: 'Bay & Mechanics', icon: Calendar, metric: '4 Bays Active' },
              ].map((item) => {
                const Icon = item.icon;
                const active = reportType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setReportType(item.id as any);
                      setGenerated(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-mono text-slate-400">{item.metric}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-600 uppercase font-semibold mb-1.5">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="today">Today (Real-time)</option>
                <option value="week">This Week (Last 7 Days)</option>
                <option value="month">This Month (Current Cycle - Rp 142.5M)</option>
                <option value="quarter">Q3 Fiscal Quarter</option>
                <option value="year">Full Year 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-600 uppercase font-semibold mb-1.5">Workshop Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="all">All Branches (Depok, Jakarta, Bandung)</option>
                <option value="depok">Depok Central HQ (Main Workshop)</option>
                <option value="jakarta">Jakarta Selatan Express Bay</option>
                <option value="bandung">Bandung Dyno & Racing Center</option>
              </select>
            </div>
          </div>

          {/* Generated Preview Card */}
          {generated && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>REPORT COMPILED SUCCESSFULLY</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">UUID: REP-2026-ANS-884</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Workshop Revenue:</span>
                  <span className="font-bold text-indigo-600">Rp 142,500,000 (+12.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Completed Bookings:</span>
                  <span className="font-bold text-slate-800">48 Jobs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">High Risk Inventory:</span>
                  <span className="text-rose-600 font-bold">V-Belts (2), Brake Pads (3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CSAT Score:</span>
                  <span className="text-emerald-600 font-bold">4.9 / 5.0 (894 reviews)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 transition"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-3">
            {generated ? (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono font-bold transition border border-slate-200"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT TXT/CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-mono font-bold transition shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT PDF</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-mono font-bold transition shadow-xs disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>COMPILING DATA...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>GENERATE NOW</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

