import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { Package, AlertTriangle, Plus, Search, Filter, RefreshCw, X, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminInventoryProps {
  inventory: InventoryItem[];
  onRestockItem: (id: string, amount: number) => void;
  onAddItem: (item: InventoryItem) => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  inventory,
  onRestockItem,
  onAddItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Item State
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryItem['category']>('Drivetrain');
  const [newStock, setNewStock] = useState(10);
  const [newMinThreshold, setNewMinThreshold] = useState(5);
  const [newPrice, setNewPrice] = useState(250000);
  const [newSupplier, setNewSupplier] = useState('');
  const [newLocation, setNewLocation] = useState('Rack A-01');

  const categories = ['ALL', 'Fluids & Oils', 'Drivetrain', 'Braking', 'Electronics & ECU', 'Exhaust & Intake'];

  const filteredInventory = inventory.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const lowStockCount = inventory.filter((i) => i.stock <= i.minThreshold).length;

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockModalItem) {
      onRestockItem(restockModalItem.id, Number(restockQty));
      setRestockModalItem(null);
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      category: newCategory,
      stock: Number(newStock),
      minThreshold: Number(newMinThreshold),
      price: Number(newPrice),
      supplier: newSupplier || 'Official Distributor',
      location: newLocation,
      status: Number(newStock) <= Number(newMinThreshold) ? 'Low Stock' : 'In Stock',
    };
    onAddItem(newItem);
    setIsAddModalOpen(false);
    confetti({ particleCount: 35, spread: 55 });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#131313] min-h-screen text-[#e5e2e1] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#e5e2e1] tracking-tight flex items-center gap-2 font-display uppercase">
            <Package className="w-5 h-5 text-[#FFE01B]" />
            Spare Parts & Workshop Inventory
          </h2>
          <p className="text-xs text-[#cec6ab] mt-0.5">
            Real-time telemetry on mechanical spares, synthetic lubricants, and racing components
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-mono font-bold text-xs rounded transition shadow-md shadow-[#FFE01B]/20 cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PART SKU</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if low stock */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-rose-500/20 text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono text-rose-300 uppercase">
                Critical Inventory Warning: {lowStockCount} Parts Below Minimum Threshold
              </p>
              <p className="text-[11px] text-[#cec6ab] font-sans">
                V-Belts, Brake pads, and racing spark plugs are running dangerously low in Depok Central.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const critical = inventory.find((i) => i.status === 'Critical Out');
              if (critical) setRestockModalItem(critical);
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-mono font-bold transition shadow-xs cursor-pointer uppercase"
          >
            Instant Restock PO
          </button>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1c1b1b] border border-[#1E293B] p-3.5 rounded shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 relative font-mono">
          <Search className="w-4 h-4 text-[#cec6ab] absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, spare part, supplier..."
            className="w-full bg-[#131313] border border-[#1E293B] text-xs font-mono rounded pl-9 pr-3 py-1.5 text-[#e5e2e1] placeholder-slate-500 focus:outline-none focus:border-[#FFE01B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition cursor-pointer uppercase ${
                selectedCategory === cat
                  ? 'bg-[#FFE01B] text-black font-bold shadow-xs'
                  : 'bg-[#131313] text-[#cec6ab] hover:text-white border border-[#1E293B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#1c1b1b] border border-[#1E293B] rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#131313] border-b border-[#1E293B] text-[#cec6ab] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">SKU & Description</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Bin Location</th>
                <th className="py-3 px-4 font-bold">Stock Qty</th>
                <th className="py-3 px-4 font-bold">Unit Price</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#131313]/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#e5e2e1] block text-xs font-display">{item.name}</span>
                      <span className="text-[10px] text-[#cec6ab]">{item.sku} • {item.supplier}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#cec6ab]">
                    <span className="px-2 py-0.5 rounded bg-[#131313] border border-[#1E293B] text-[#e5e2e1] text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#cec6ab]">{item.location}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-bold ${
                        item.stock <= item.minThreshold ? 'text-rose-400 font-black' : 'text-[#e5e2e1]'
                      }`}>
                        {item.stock}
                      </span>
                      <span className="text-[10px] text-[#cec6ab]">/ min {item.minThreshold}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#FFE01B]">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.stock <= 3
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.stock <= item.minThreshold
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      }`}
                    >
                      {item.stock <= 3 ? 'Critical Out' : item.stock <= item.minThreshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setRestockModalItem(item)}
                      className="px-2.5 py-1 bg-[#131313] hover:bg-[#FFE01B] hover:text-black text-[#FFE01B] border border-[#1E293B] rounded text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer uppercase font-mono"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Restock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <RefreshCw className="w-4 h-4 text-[#FFE01B]" />
                Restock Spare Part
              </h3>
              <button onClick={() => setRestockModalItem(null)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-3.5 font-mono text-xs">
              <div className="p-3 bg-[#131313] border border-[#1E293B] rounded space-y-0.5">
                <p className="font-bold text-white text-xs">{restockModalItem.name}</p>
                <p className="text-[#cec6ab] text-[11px]">{restockModalItem.sku} • Current Stock: {restockModalItem.stock}</p>
              </div>

              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Quantity to Add (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#FFE01B] text-sm font-bold focus:border-[#FFE01B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-[#cec6ab] py-1">
                <span>New Total Estimated Stock:</span>
                <span className="text-[#CCFF00] font-bold text-sm">
                  {restockModalItem.stock + Number(restockQty)} Units
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFE01B] text-black font-bold rounded uppercase tracking-wider cursor-pointer"
                >
                  Confirm Restock PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Part Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] font-display text-base flex items-center gap-2 uppercase">
                <Plus className="w-5 h-5 text-[#FFE01B]" />
                Register New Inventory Part
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Part Name & Specification</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Malossi Multivar 2000 Variator Kit"
                  className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Part SKU</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. MAL-VAR-AER155"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  >
                    <option value="Drivetrain">Drivetrain</option>
                    <option value="Fluids & Oils">Fluids & Oils</option>
                    <option value="Braking">Braking</option>
                    <option value="Electronics & ECU">Electronics & ECU</option>
                    <option value="Exhaust & Intake">Exhaust & Intake</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Initial Qty</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Min Alert</label>
                  <input
                    type="number"
                    required
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Unit Price (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#FFE01B] focus:border-[#FFE01B] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Supplier</label>
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="e.g. PT Malossi Racing Indonesia"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[#cec6ab] mb-1 uppercase font-semibold">Storage Bin / Rack</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Rack A-04"
                    className="w-full bg-[#131313] border border-[#1E293B] rounded p-2 text-[#e5e2e1] focus:border-[#FFE01B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-[#cec6ab] hover:text-white cursor-pointer uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFE01B] text-black font-bold rounded uppercase tracking-wider cursor-pointer"
                >
                  Save Part to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

