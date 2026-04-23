import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, AlertTriangle, Search, Loader2, 
  Plus, Edit3, Trash2, X, ArrowDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
}

const Inventory = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingIng, setEditingIng] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    stock: 0,
    lowStockThreshold: 5
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/ingredients');
      setIngredients(res.data);
    } catch (err) {
      toast.error("Could not load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ing: Ingredient | null = null) => {
    if (ing) {
      setEditingIng(ing);
      setFormData({
        name: ing.name,
        unit: ing.unit,
        stock: ing.stock,
        lowStockThreshold: ing.lowStockThreshold
      });
    } else {
      setEditingIng(null);
      setFormData({ name: '', unit: '', stock: 0, lowStockThreshold: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingIng) {
        await axios.patch(`http://localhost:3000/api/ingredients/${editingIng.id}`, formData);
        toast.success("Stock updated successfully");
      } else {
        await axios.post('http://localhost:3000/api/ingredients', formData);
        toast.success("New ingredient added");
      }
      setIsModalOpen(false);
      fetchIngredients();
    } catch (err) {
      toast.error("Failed to save ingredient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this ingredient?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/ingredients/${id}`);
      toast.success("Ingredient removed");
      fetchIngredients();
    } catch (err) {
      toast.error("Cannot delete item");
    }
  };

  const filtered = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Locked height for 1080p to prevent full-page scroll
    <div className="p-6 h-[calc(100vh-20px)] max-w-[1850px] mx-auto flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      {/* Header - Fixed */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Warehouse</h1>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2 ml-1">
            Oftsy Raw Material Engine
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={18} /> New Material
        </button>
      </div>

      {/* Quick Stats - Optimized spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Materials</p>
          <p className="text-4xl font-black text-slate-900 tabular-nums">{ingredients.length}</p>
        </div>
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Critical Stock Alerts</p>
          <div className="flex items-center gap-4">
            <p className="text-4xl font-black text-amber-700 tabular-nums">
              {ingredients.filter(i => i.stock <= i.lowStockThreshold).length}
            </p>
            {ingredients.filter(i => i.stock <= i.lowStockThreshold).length > 0 && <AlertTriangle className="text-amber-500 animate-bounce" />}
          </div>
        </div>
        <div className="bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest relative z-10">Database Status</p>
          <p className="text-4xl font-black text-white italic relative z-10 tracking-tighter">SECURED</p>
          <Package className="absolute -right-4 -bottom-4 text-white/10" size={120} />
        </div>
      </div>

      {/* Toolbar - Sticky feel */}
      <div className="relative mb-6 shrink-0">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
        <input 
          type="text"
          placeholder="Filter warehouse items by name..."
          className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-20 pr-8 outline-none focus:ring-8 focus:ring-blue-500/5 font-bold shadow-sm transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Scrollable Data Table Container */}
      <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col mb-4">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Identification</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Inventory</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe Level</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert Status</th>
                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600" size={40} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Accessing Warehouse...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-32 text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">No Materials Found</p>
                   </td>
                </tr>
              ) : filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                        <Package size={20} />
                      </div>
                      <p className="font-black text-slate-900 text-base uppercase tracking-tighter italic">{ing.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <p className="font-black text-slate-900 text-lg tabular-nums">
                      {ing.stock} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">{ing.unit}</span>
                    </p>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2 text-slate-400">
                       <ArrowDown size={14} />
                       <p className="font-bold text-sm italic">&gt; {ing.lowStockThreshold} {ing.unit}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    {ing.stock <= ing.lowStockThreshold ? (
                      <span className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest w-fit animate-pulse border border-red-100">
                        <AlertTriangle size={12} /> Refill Needed
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border border-emerald-100">
                        Stock Stable
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(ing)}
                        className="p-4 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ing.id)}
                        className="p-4 bg-slate-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal - High Emphasis Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300 relative border border-white/20">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X size={32} />
            </button>

            <div className="mb-10">
               <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                {editingIng ? 'Modify Stock' : 'Register Material'}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Warehouse Entry Protocol v1</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Full Material Name</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-[2rem] p-6 font-black text-slate-900 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder="e.g. DARK CHOCOLATE CHIPS"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Unit (kg/L/etc)</label>
                  <input 
                    className="w-full bg-slate-50 border-none rounded-[2rem] p-6 font-black text-slate-900 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                    placeholder="Liters"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Low Alert Trigger</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-none rounded-[2rem] p-6 font-black text-slate-900 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none"
                    value={formData.lowStockThreshold}
                    onChange={e => setFormData({...formData, lowStockThreshold: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[3rem] shadow-xl border border-white/5 group">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-2 mb-2 block group-hover:animate-pulse">Quantity In Hand</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-transparent text-white border-none p-0 font-black text-6xl outline-none tabular-nums"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseFloat(e.target.value)})}
                    required
                  />
                  <span className="text-xl font-black text-slate-600 uppercase italic tracking-tighter">{formData.unit || '...'}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:grayscale"
              >
                {submitting ? <Loader2 className="animate-spin" /> : editingIng ? 'Commit Updates' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;