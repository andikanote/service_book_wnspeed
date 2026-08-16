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
    <div className="p-6 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Spare Parts & Workshop Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry on mechanical spares, synthetic lubricants, and racing components
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PART SKU</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if low stock */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-mono text-rose-800 uppercase">
                Critical Inventory Warning: {lowStockCount} Parts Below Minimum Threshold
              </p>
              <p className="text-[11px] text-rose-600">
                V-Belts, Brake pads, and racing spark plugs are running dangerously low in Depok Central.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const critical = inventory.find((i) => i.status === 'Critical Out');
              if (critical) setRestockModalItem(critical);
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-mono font-bold transition shadow-xs"
          >
            Instant Restock PO
          </button>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, spare part, supplier..."
            className="w-full bg-slate-50 border border-slate-200 text-xs font-mono rounded-lg pl-9 pr-3 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.sku} • {item.supplier}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.location}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-bold ${
                        item.stock <= item.minThreshold ? 'text-rose-600 font-black' : 'text-slate-800'
                      }`}>
                        {item.stock}
                      </span>
                      <span className="text-[10px] text-slate-400">/ min {item.minThreshold}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">
                    Rp {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.stock <= 3
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.stock <= item.minThreshold
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.stock <= 3 ? 'Critical Out' : item.stock <= item.minThreshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setRestockModalItem(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-mono text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                Restock Spare Part
              </h3>
              <button onClick={() => setRestockModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-3.5 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">{restockModalItem.name}</p>
                <p className="text-slate-500 text-[11px]">{restockModalItem.sku} • Current Stock: {restockModalItem.stock}</p>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 uppercase font-semibold">Quantity to Add (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 text-sm font-bold focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-slate-600 py-1">
                <span>New Total Estimated Stock:</span>
                <span className="text-indigo-600 font-bold text-sm">
                  {restockModalItem.stock + Number(restockQty)} Units
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg uppercase"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-mono text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Register New Inventory Part
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-600 mb-1 uppercase font-semibold">Part Name & Specification</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Malossi Multivar 2000 Variator Kit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Part SKU</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. MAL-VAR-AER155"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
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
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Initial Qty</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Min Alert</label>
                  <input
                    type="number"
                    required
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Unit Price (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Supplier</label>
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="e.g. PT Malossi Racing Indonesia"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 uppercase font-semibold">Storage Bin / Rack</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Rack A-04"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg uppercase"
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

