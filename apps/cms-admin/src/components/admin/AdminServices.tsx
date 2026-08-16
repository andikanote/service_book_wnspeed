import React, { useState } from 'react';
import { SERVICE_CATALOG } from '../../data/mockData';
import { ServicePackage } from '../../types';
import { Wrench, Plus, Clock, Check, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServicePackage[]>(SERVICE_CATALOG);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General Maintenance');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(350000);
  const [description, setDescription] = useState('');
  const [includesText, setIncludesText] = useState('Oil Change\nSpark plug inspect\nDiagnostics scan');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: ServicePackage = {
      id: `srv-${Date.now()}`,
      name,
      category,
      durationMinutes: Number(duration),
      price: Number(price),
      description,
      popular: true,
      includes: includesText.split('\n').filter((s) => s.trim().length > 0),
    };
    setServices([newService, ...services]);
    setIsAddOpen(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
            <Wrench className="w-5 h-5 text-[#FFE01B]" />
            Workshop Service Packages & Menu
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Configure tuning packages, standard rates, technician estimated times, and required procedures
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE SERVICE PACKAGE</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-5 flex flex-col justify-between space-y-4 transition shadow-xs relative overflow-hidden"
          >
            {srv.popular && (
              <div className="absolute top-0 right-0 bg-[#FFE01B] text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-bl uppercase tracking-wider">
                POPULAR
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FFE01B] uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{srv.category}</span>
              </div>

              <h3 className="text-base font-bold text-[#e5e2e1] font-display uppercase mt-1">{srv.name}</h3>
              <p className="text-xs text-[#cec6ab] font-sans mt-1.5 leading-relaxed">{srv.description}</p>

              <div className="mt-3.5 pt-3.5 border-t border-[#1E293B] space-y-1.5">
                <span className="text-[10px] font-mono text-[#cec6ab] font-bold uppercase block">
                  Package Inclusions:
                </span>
                <ul className="space-y-1 text-xs font-mono text-[#e5e2e1]">
                  {srv.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#1E293B] flex items-center justify-between font-mono">
              <div className="flex items-center gap-1 text-xs text-[#cec6ab]">
                <Clock className="w-3.5 h-3.5 text-[#FFE01B]" />
                <span>{srv.durationMinutes} mins</span>
              </div>
              <span className="text-base font-black font-mono text-[#FFE01B]">
                Rp {srv.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Plus className="w-5 h-5 text-[#FFE01B]" />
                New Workshop Service Package
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Service Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Brake Line & Caliper Bleed"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Est. Minutes</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Price (Rp)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#FFE01B] focus:border-[#FFE01B] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of procedure..."
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Included Steps (1 per line)</label>
                <textarea
                  rows={3}
                  value={includesText}
                  onChange={(e) => setIncludesText(e.target.value)}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFE01B] text-black font-bold rounded uppercase tracking-wider cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

