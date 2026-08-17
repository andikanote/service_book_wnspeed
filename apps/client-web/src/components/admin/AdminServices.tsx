import React, { useState, useEffect } from 'react';
import { ServicePackage } from '../../types';
import { apiClient } from '../../services/api';
import { 
  Wrench, 
  Plus, 
  Clock, 
  Check, 
  Sparkles, 
  X, 
  RefreshCw, 
  AlertCircle,
  Database,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isBackendSynced, setIsBackendSynced] = useState(false);

  // Modal & Form State for Create
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('General Maintenance');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(350000);
  const [isPopular, setIsPopular] = useState(true);
  const [description, setDescription] = useState('');
  const [includesText, setIncludesText] = useState('Dyno Baseline Scan\nOil & Filter Replacement\nBrake Caliper Servicing');

  // Modal & State for Delete
  const [serviceToDelete, setServiceToDelete] = useState<ServicePackage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 1. GET /api/v1/services
  const loadServices = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await apiClient.get('/services');
      if (Array.isArray(data)) {
        const mapped: ServicePackage[] = data.map((item: any) => ({
          id: item.id || `srv-${Date.now()}`,
          name: item.name,
          category: item.category || 'General Maintenance',
          durationMinutes: Number(item.durationMinutes || item.duration_minutes || 60),
          price: Number(item.price || 0),
          popular: Boolean(item.isPopular ?? item.is_popular ?? false),
          description: item.description || '',
          includes: Array.isArray(item.includesItems)
            ? item.includesItems
            : Array.isArray(item.includes_items)
            ? item.includes_items
            : [],
        }));

        setServices(mapped);
        setIsBackendSynced(true);
      }
    } catch (err: any) {
      console.warn('GET /api/v1/services failed, using local mock state:', err);
      setFetchError(err?.message || 'Gagal memuat katalog service dari database backend.');
      setIsBackendSynced(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // 2. POST /api/v1/services
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const items = includesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: name.trim(),
      category: category.trim(),
      durationMinutes: Number(duration),
      price: Number(price),
      isPopular: Boolean(isPopular),
      description: description.trim(),
      includesItems: items,
    };

    try {
      const createdItem = await apiClient.post('/services', payload);

      if (createdItem && createdItem.id) {
        const newService: ServicePackage = {
          id: createdItem.id,
          name: createdItem.name,
          category: createdItem.category,
          durationMinutes: Number(createdItem.durationMinutes || duration),
          price: Number(createdItem.price || price),
          popular: Boolean(createdItem.isPopular ?? isPopular),
          description: createdItem.description || description,
          includes: Array.isArray(createdItem.includesItems) ? createdItem.includesItems : items,
        };

        setServices((prev) => [newService, ...prev]);
      } else {
        await loadServices();
      }

      setIsAddOpen(false);
      // Reset form
      setName('');
      setDescription('');
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      setSubmitError(err?.message || 'Gagal menyimpan paket service ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE /api/v1/services/:id
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiClient.delete(`/services/${serviceToDelete.id}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err: any) {
      setDeleteError(err?.message || 'Gagal menghapus paket service dari database.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
              <Wrench className="w-5 h-5 text-[#FFE01B]" />
              Workshop Service Packages & Menu
            </h2>
            {isBackendSynced ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                API Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                <Database className="w-3 h-3" />
                Local Cache
              </span>
            )}
          </div>
          <p className="text-xs text-[#cec6ab] mt-0.5 font-mono">
            Synchronized with <code className="text-[#FFE01B]">GET</code>, <code className="text-[#FFE01B]">POST</code>, & <code className="text-rose-400">DELETE /api/v1/services</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadServices}
            disabled={isLoading}
            title="Refresh Service Packages from API"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1c1b1b] hover:bg-[#2a2a2a] border border-[#1E293B] hover:border-[#FFE01B]/40 text-[#cec6ab] hover:text-white font-mono text-xs rounded transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FFE01B]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              setSubmitError(null);
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE SERVICE PACKAGE</span>
          </button>
        </div>
      </div>

      {/* Notice if Backend is Offline */}
      {fetchError && (
        <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Status API: {fetchError} (Menampilkan data katalog lokal).</span>
          </div>
          <button
            onClick={loadServices}
            className="px-2.5 py-1 bg-amber-400 text-black font-bold text-[10px] rounded uppercase cursor-pointer hover:bg-amber-300"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Services Grid */}
      {isLoading && services.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 font-mono">
          <div className="w-8 h-8 border-2 border-[#FFE01B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#cec6ab]">Memuat paket service dari Backend API...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#1c1b1b] border border-[#1E293B] hover:border-[#FFE01B]/40 rounded p-5 flex flex-col justify-between space-y-4 transition shadow-xs relative overflow-hidden group"
            >
              {srv.popular && (
                <div className="absolute top-0 right-0 bg-[#FFE01B] text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-bl uppercase tracking-wider">
                  POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FFE01B] uppercase font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{srv.category}</span>
                  </div>

                  {/* Delete Trigger Button */}
                  <button
                    onClick={() => {
                      setDeleteError(null);
                      setServiceToDelete(srv);
                    }}
                    title={`Hapus paket ${srv.name}`}
                    className="opacity-70 group-hover:opacity-100 p-1.5 rounded hover:bg-rose-500/20 text-[#cec6ab] hover:text-rose-400 border border-transparent hover:border-rose-500/40 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#e5e2e1] font-display uppercase mt-1">{srv.name}</h3>
                <p className="text-xs text-[#cec6ab] font-sans mt-1.5 leading-relaxed">{srv.description}</p>

                <div className="mt-3.5 pt-3.5 border-t border-[#1E293B] space-y-1.5">
                  <span className="text-[10px] font-mono text-[#cec6ab] font-bold uppercase block">
                    Package Inclusions:
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-[#e5e2e1]">
                    {srv.includes && srv.includes.length > 0 ? (
                      srv.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[11px] text-slate-500 italic">Standar workshop inspection</li>
                    )}
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
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Plus className="w-5 h-5 text-[#FFE01B]" />
                New Workshop Service Package
              </h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                disabled={isSubmitting}
                className="text-[#cec6ab] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleAddService} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Service Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Brake Line & Caliper Bleed"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Est. Minutes *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Price (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#FFE01B] focus:border-[#FFE01B] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPopularCheck"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded border-[#1E293B] text-[#FFE01B] focus:ring-0 cursor-pointer accent-[#FFE01B]"
                />
                <label htmlFor="isPopularCheck" className="text-[#cec6ab] font-sans text-xs cursor-pointer select-none">
                  Tandai sebagai Paket Populer (Highlight Badge)
                </label>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of procedure..."
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Included Steps (1 per line)</label>
                <textarea
                  rows={3}
                  value={includesText}
                  onChange={(e) => setIncludesText(e.target.value)}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2.5 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] disabled:opacity-50 text-black font-bold rounded uppercase tracking-wider cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Menyimpan ke DB...</span>
                    </>
                  ) : (
                    <span>Save to Database</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-rose-500/40 rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-rose-400 font-display text-base flex items-center gap-2 uppercase">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Hapus Paket Service
              </h3>
              <button 
                onClick={() => setServiceToDelete(null)} 
                disabled={isDeleting}
                className="text-[#cec6ab] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {deleteError && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-2 text-[#cec6ab] font-sans">
              <p>Apakah Anda yakin ingin menghapus paket service berikut dari database?</p>
              <div className="p-3 bg-[#131313] border border-[#1E293B] rounded font-mono text-xs space-y-1">
                <p className="font-bold text-[#e5e2e1] text-sm uppercase">{serviceToDelete.name}</p>
                <p className="text-[#FFE01B] text-[11px]">Kategori: {serviceToDelete.category}</p>
                <p className="text-[#cec6ab] text-[11px]">Harga: Rp {serviceToDelete.price.toLocaleString('id-ID')}</p>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * Tindakan ini permanen dan akan menghapus paket dari API/database.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase font-mono disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteService}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-mono font-bold rounded uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-md shadow-rose-600/20"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

