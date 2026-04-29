import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Plus, Search, 
  Boxes, X, 
  Trash2, Edit3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ingredient {
  id: string;
  name: string;
  stock: number;
  unit: any;
  unitId: string;
  lowStockThreshold: number;
}

const Inventory = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIng, setEditingIng] = useState<Ingredient | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    unitId: '',
    lowStockThreshold: 10
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ingRes, unitRes] = await Promise.all([
        api.get('/ingredients'),
        api.get('/units')
      ]);
      setIngredients(ingRes.data);
      setUnits(unitRes.data);
    } catch (err) {
      toast.error("Failed to sync inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIng) {
        await api.patch(`/ingredients/${editingIng.id}`, formData);
        toast.success("Item updated successfully");
      } else {
        await api.post('/ingredients', formData);
        toast.success("New item added to inventory");
      }
      setIsModalOpen(false);
      setEditingIng(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to save item");
    }
  };

  const deleteIngredient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/ingredients/${id}`);
      setIngredients(ingredients.filter(i => i.id !== id));
      toast.success("Item removed from inventory");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const openEdit = (ing: Ingredient) => {
    setEditingIng(ing);
    setFormData({
      name: ing.name,
      stock: ing.stock,
      unitId: ing.unitId,
      lowStockThreshold: ing.lowStockThreshold
    });
    setIsModalOpen(true);
  };

  const filtered = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Boxes size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              frosted <span className="text-brand">Inventory</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Manage your stock and supplies</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={18} />
            <input 
              type="text"
              placeholder="Search items..."
              className="bg-panel border-2 border-border-frosted rounded-2xl py-4 pl-14 pr-6 w-80 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingIng(null); setFormData({ name: '', stock: 0, unitId: '', lowStockThreshold: 10 }); setIsModalOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20"
          >
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="industrial-card rounded-[2.5rem] border-2 border-white/5 flex-1 overflow-hidden flex flex-col bg-surface/30 backdrop-blur-3xl">
        <div className="overflow-y-auto flex-1 no-scrollbar p-6">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 z-10 bg-surface/50 backdrop-blur-xl">
              <tr className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                <th className="px-8 py-3">Item Name</th>
                <th className="px-8 py-3">Unit</th>
                <th className="px-8 py-3">In Stock</th>
                <th className="px-8 py-3">Low Stock Alert</th>
                <th className="px-8 py-3">Status</th>
                <th className="px-8 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ing => (
                <tr key={ing.id} className="bg-panel/50 hover:bg-panel transition-all">
                  <td className="px-8 py-4 font-black text-text-main uppercase tracking-tighter italic">{ing.name}</td>
                  <td className="px-8 py-4 font-black text-text-muted uppercase tracking-widest text-[10px]">{ing.unit?.name || 'Units'}</td>
                  <td className="px-8 py-4 font-black text-xl text-text-main tabular-nums">{ing.stock}</td>
                  <td className="px-8 py-4 font-black text-text-muted tabular-nums">{ing.lowStockThreshold}</td>
                  <td className="px-8 py-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${ing.stock <= ing.lowStockThreshold ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-brand/10 text-brand border-brand/20'}`}>
                      {ing.stock <= ing.lowStockThreshold ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => openEdit(ing)} className="p-2.5 bg-brand/5 text-brand rounded-xl hover:bg-brand hover:text-white transition-all">
                          <Edit3 size={16} />
                       </button>
                       <button onClick={(e) => deleteIngredient(ing.id, e)} className="p-2.5 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
               <Boxes size={64} className="mb-4" />
               <p className="font-black text-xs uppercase tracking-widest">No inventory items found</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
           <div className="bg-surface w-full max-w-xl rounded-[3rem] shadow-glow border-2 border-brand/20 overflow-hidden">
              <div className="p-10 border-b-2 border-border-frosted flex justify-between items-center bg-surface/50">
                 <div>
                    <h3 className="text-2xl font-black text-text-main uppercase italic">{editingIng ? 'Update Item' : 'Add New Item'}</h3>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5">Enter stock and unit details</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-panel rounded-2xl text-text-muted hover:text-brand transition-all border-2 border-border-frosted">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-12 space-y-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Item Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-sm uppercase"
                      placeholder="e.g. Organic Milk"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Measurement Unit</label>
                       <select 
                         value={formData.unitId}
                         onChange={(e) => setFormData({...formData, unitId: e.target.value})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase tracking-widest cursor-pointer"
                         required
                       >
                         <option value="">Select Unit</option>
                         {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Current Stock</label>
                       <input 
                         type="number"
                         value={formData.stock}
                         onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-sm uppercase"
                         placeholder="0"
                         required
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Low Stock Alert Level</label>
                    <input 
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({...formData, lowStockThreshold: Number(e.target.value)})}
                      className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-sm uppercase"
                      placeholder="10"
                      required
                    />
                 </div>
                 <button type="submit" className="w-full py-6 bg-brand text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20">
                    {editingIng ? 'Update Stock Item' : 'Add Stock Item'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
