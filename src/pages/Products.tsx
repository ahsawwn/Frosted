import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Pencil, Trash2, X, LayoutGrid, List, 
  Search, Package, ChevronRight, Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  category: Category;
}

const API_URL = 'http://localhost:3000/api';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Database connection failed");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      
      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, payload);
        toast.success("Product Updated");
      } else {
        await axios.post(`${API_URL}/products`, payload);
        toast.success("New Item Added");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Action failed - Check backend logs");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently remove this item?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      toast.success("Item Deleted");
      fetchData();
    } catch (err) {
      toast.error("Could not delete item");
    }
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', categoryId: '', imageUrl: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Inventory</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Oftsy Catalog Management</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Search catalog..."
              className="bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold w-64 outline-none focus:ring-4 focus:ring-slate-50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-slate-100 p-1.5 rounded-2xl flex">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}>
              <LayoutGrid size={20} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}>
              <List size={20} />
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white h-[58px] px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-black text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-black text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* VIEW MODES */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-4 hover:shadow-2xl transition-all duration-500">
              <div className="relative h-60 w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-100">
                <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => openEdit(p)} className="p-3 bg-white rounded-xl text-black shadow-lg hover:bg-black hover:text-white transition-all"><Pencil size={16}/></button>
                   <button onClick={() => handleDelete(p.id)} className="p-3 bg-white rounded-xl text-black shadow-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="px-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 block">{p.category?.name}</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">{p.name}</h3>
                <p className="text-2xl font-black text-black mt-2">₨ {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                <th className="p-8 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-6 flex items-center gap-5">
                    <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                    <span className="font-black text-slate-900 uppercase tracking-tight">{p.name}</span>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">{p.category?.name}</span>
                  </td>
                  <td className="p-6 font-black text-slate-900 text-lg">₨ {p.price}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-3 text-slate-300 hover:text-black transition-colors"><Pencil size={20}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black uppercase tracking-tighter">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={resetForm} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-black transition-all" placeholder="Vanilla Bean..." />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (PKR)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                    <option value="">Select...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Image URL</label>
                <input required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-black transition-all" />
              </div>

              <button type="submit" className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl">
                {editingId ? 'Save Product' : 'Add to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;