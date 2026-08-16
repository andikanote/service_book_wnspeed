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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#131313]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFE01B]/10 text-[#FFE01B] border border-[#FFE01B]/30 rounded">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#e5e2e1] font-display uppercase tracking-wider">Generate Workshop Report</h3>
              <p className="text-xs text-[#cec6ab]">ART N SPEED Analytics & Intelligence Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#cec6ab] hover:text-white p-1 rounded hover:bg-[#201f1f] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-mono text-[#cec6ab] uppercase font-semibold mb-2">Select Report Category</label>
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
                    className={`p-3 rounded border text-left transition flex flex-col justify-between cursor-pointer ${
                      active
                        ? 'border-[#FFE01B] bg-[#FFE01B]/10 text-white shadow-xs'
                        : 'border-[#1E293B] bg-[#131313] text-[#cec6ab] hover:border-[#FFE01B]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-[#FFE01B]' : 'text-[#cec6ab]'}`} />
                      <span className="text-[10px] font-mono text-[#cec6ab]">{item.metric}</span>
                    </div>
                    <span className="text-xs font-bold font-mono">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#cec6ab] uppercase font-semibold mb-1.5">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] text-[#e5e2e1] rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FFE01B]"
              >
                <option value="today">Today (Real-time)</option>
                <option value="week">This Week (Last 7 Days)</option>
                <option value="month">This Month (Current Cycle - Rp 142.5M)</option>
                <option value="quarter">Q3 Fiscal Quarter</option>
                <option value="year">Full Year 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#cec6ab] uppercase font-semibold mb-1.5">Workshop Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-[#131313] border border-[#1E293B] text-[#e5e2e1] rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FFE01B]"
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
            <div className="p-4 rounded bg-[#131313] border border-[#1E293B] space-y-2.5 animate-in fade-in zoom-in-95 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>REPORT COMPILED SUCCESSFULLY</span>
                </div>
                <span className="text-[11px] text-[#cec6ab]">UUID: REP-2026-ANS-884</span>
              </div>

              <div className="bg-[#1c1b1b] p-3 rounded border border-[#1E293B] text-xs space-y-1.5 text-[#e5e2e1]">
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Total Workshop Revenue:</span>
                  <span className="font-bold text-[#FFE01B]">Rp 142,500,000 (+12.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">Total Completed Bookings:</span>
                  <span className="font-bold text-white">48 Jobs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">High Risk Inventory:</span>
                  <span className="text-rose-400 font-bold">V-Belts (2), Brake Pads (3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cec6ab]">CSAT Score:</span>
                  <span className="text-[#CCFF00] font-bold">4.9 / 5.0 (894 reviews)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E293B] bg-[#131313] font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#cec6ab] hover:text-white transition cursor-pointer uppercase"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-3">
            {generated ? (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#1c1b1b] hover:bg-[#201f1f] text-[#e5e2e1] rounded text-xs font-mono font-bold transition border border-[#1E293B] cursor-pointer uppercase"
                >
                  <Download className="w-4 h-4 text-[#FFE01B]" />
                  <span>EXPORT TXT/CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black rounded text-xs font-mono font-bold transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT PDF</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black rounded text-xs font-mono font-bold transition shadow-md shadow-[#FFE01B]/20 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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

