import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, 
  Tag, X, Trash2, 
  Image as ImageIcon,
  MonitorCog, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  prepTime: number;
  imageUrl: string;
  categoryId: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
  _count?: { products: number };
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    prepTime: 5,
    imageUrl: '',
    categoryId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:3000/api/products'),
        axios.get('http://localhost:3000/api/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Failed to load catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.patch(`http://localhost:3000/api/products/${editingProduct.id}`, formData);
        toast.success("Product updated");
      } else {
        await axios.post('http://localhost:3000/api/products', formData);
        toast.success("Product added to catalog");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/categories', { name: categoryName });
      toast.success("Category created");
      setIsCategoryModalOpen(false);
      setCategoryName('');
      fetchData();
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product from catalog?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product removed");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const deleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this category? This only works if it's empty.")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Category removed");
    } catch (err) {
      toast.error("Cannot delete category with products");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <MonitorCog size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              Oftsy <span className="text-brand">Product List</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Manage your store menu and items</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              className="bg-panel border-2 border-border-oftsy rounded-2xl py-4 pl-14 pr-6 w-64 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-4 bg-panel border-2 border-border-oftsy rounded-2xl font-black text-[10px] uppercase tracking-widest text-text-muted hover:text-brand hover:border-brand transition-all"
          >
            <Tag size={18} /> Add Category
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setFormData({ name: '', price: 0, prepTime: 5, imageUrl: '', categoryId: '' }); setIsModalOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden relative">
        {/* SIDEBAR: CATEGORIES */}
        <div className="w-64 glass-panel rounded-[2.5rem] p-6 border-2 border-white/5 flex flex-col space-y-2 overflow-y-auto no-scrollbar shrink-0 z-20 relative shadow-xl">
          <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 ml-2">Product Categories</p>
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${selectedCategory === 'all' ? 'bg-brand text-white border-brand shadow-glow' : 'bg-panel text-text-muted border-transparent hover:border-brand/30'}`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <div key={cat.id} className="relative group/cat">
               <button 
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${selectedCategory === cat.id ? 'bg-brand text-white border-brand shadow-glow' : 'bg-panel text-text-muted border-transparent hover:border-brand/30'}`}
               >
                  {cat.name}
                  <span className="block text-[8px] mt-0.5 opacity-60 font-black">{cat._count?.products || 0} ITEMS</span>
               </button>
               <button 
                  onClick={(e) => deleteCategory(cat.id, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-red-400 opacity-0 group-hover/cat:opacity-100 transition-all"
               >
                  <Trash2 size={12} />
               </button>
            </div>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredProducts.map(p => (
               <div key={p.id} className="industrial-card rounded-[2.5rem] overflow-hidden group border-2 border-white/5 shadow-lg flex flex-col h-full bg-surface/50">
                  <div className="relative aspect-[4/3] overflow-hidden">
                     <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                        <div className="flex gap-2 w-full">
                           <button onClick={() => { setEditingProduct(p); setFormData({ name: p.name, price: p.price, prepTime: p.prepTime, imageUrl: p.imageUrl, categoryId: p.categoryId }); setIsModalOpen(true); }} className="flex-1 bg-white text-brand py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-glow">
                              Edit
                           </button>
                           <button onClick={() => deleteProduct(p.id)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-glow">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-2">
                        <p className="text-[9px] font-black text-brand uppercase tracking-widest">{p.category?.name || 'N/A'}</p>
                        <p className="text-xl font-black text-text-main tabular-nums tracking-tighter italic leading-none">₨{p.price}</p>
                     </div>
                     <h3 className="text-base font-black text-text-main uppercase tracking-tighter italic mt-1">{p.name}</h3>
                  </div>
               </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center py-40 opacity-20">
                <MonitorCog size={64} className="mb-4" />
                <p className="font-black text-xs uppercase tracking-widest">No products found in this category</p>
             </div>
          )}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-surface w-full max-w-3xl rounded-[4rem] shadow-glow overflow-hidden relative border-2 border-brand/20">
            <div className="flex justify-between items-center p-12 border-b-2 border-border-oftsy backdrop-blur-3xl bg-surface/50">
              <div>
                <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter italic">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-2 focus:border-brand">Enter product details</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-panel rounded-2xl text-text-muted hover:text-brand transition-all border-2 border-border-oftsy">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2">Product Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-panel border-2 border-border-oftsy rounded-3xl py-6 px-8 outline-none focus:border-brand font-black text-sm uppercase transition-all"
                      placeholder="e.g. Vanilla Scoop"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2">Price</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-text-muted">PKR</span>
                      <input 
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-panel border-2 border-border-oftsy rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand font-black text-sm uppercase transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2">Product Image (URL)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                      <input 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full bg-panel border-2 border-border-oftsy rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand font-black text-sm transition-all"
                        placeholder="https://images.unsplash.com..."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2">Select Category</label>
                    <div className="relative">
                      <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                      <select 
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full bg-panel border-2 border-border-oftsy rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand font-black text-sm uppercase cursor-pointer"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2">Preparation Time (Minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                      type="number"
                      value={formData.prepTime || ''}
                      onChange={(e) => setFormData({...formData, prepTime: Number(e.target.value)})}
                      className="w-full bg-panel border-2 border-border-oftsy rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand font-black text-sm uppercase transition-all"
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                </div>

               <button type="submit" className="w-full py-8 bg-brand text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20 mt-4">
                 {editingProduct ? 'Update Product' : 'Add Product'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
           <div className="bg-surface w-full max-w-md rounded-[3rem] shadow-glow border-2 border-brand/20 overflow-hidden">
              <div className="p-8 border-b-2 border-border-oftsy flex justify-between items-center">
                 <h3 className="text-xl font-black text-text-main uppercase italic">Add New Category</h3>
                 <button onClick={() => setIsCategoryModalOpen(false)} className="text-text-muted hover:text-brand"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateCategory} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-2">Category Name</label>
                    <input 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase"
                      placeholder="e.g. Ice Creams"
                      required
                    />
                 </div>
                 <button type="submit" className="w-full py-5 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20">
                    Save Category
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;