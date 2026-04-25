import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ChefHat, History, 
  TrendingUp, Package, Calendar, Clock 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:3000/api';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">LOADING SYSTEM...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BACK BUTTON & HEADER */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-black transition-all font-black text-[10px] uppercase tracking-widest mb-8"
      >
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: IMAGE & STATS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-2xl">
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          </div>
          
          <div className="bg-black text-white p-10 rounded-[3rem] flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Market Price</p>
              <h2 className="text-4xl font-black italic">₨ {product.price}</h2>
            </div>
            <TrendingUp size={48} className="text-brand opacity-50" />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & RECIPE */}
        <div className="lg:col-span-7 space-y-8">
          <section>
            <span className="px-4 py-1.5 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-widest">
              {product.category?.name || 'Retail'}
            </span>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 mt-4 leading-none">
              {product.name}
            </h1>
          </section>

          {/* RECIPE / INGREDIENTS SECTION */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10">
  <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight mb-6">
    <ChefHat className="text-brand" size={24} /> Production Recipe
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {product.ingredients.map((item: any, i: number) => (
  <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl font-bold text-sm">
    {/* Notice the nested '.ingredient' call here */}
    <span className="text-slate-500">
      {item.ingredient?.name || "Unknown Item"}
    </span>
    <span className="text-black">
      {item.quantity} {item.ingredient?.unit?.short || "qty"}
    </span>
  </div>
))}
  </div>
</div>

          {/* SALES HISTORY / LAST SOLD */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10">
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight mb-6">
              <History className="text-brand" size={24} /> Terminal Logs (Last Sold)
            </h3>
            <div className="space-y-4">
               {/* Replace with actual transaction data from your POS module */}
               <div className="flex items-center justify-between p-5 border border-slate-50 rounded-3xl hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl"><Clock size={18}/></div>
                    <div>
                      <p className="font-black text-sm uppercase">Order #8821</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Yesterday • 04:20 PM</p>
                    </div>
                  </div>
                  <p className="font-black text-lg">₨ {product.price}</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductView;