import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Minus, Trash2, CreditCard, 
  Banknote, ReceiptText, ShoppingBag, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReceiptModal from '../components/ReceiptModal';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: any;
  imageUrl: string;
  categoryId: string;
}

interface CartItem extends Product {
  quantity: number;
}

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:3000/api/products'),
        axios.get('http://localhost:3000/api/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("Failed to sync inventory");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxRate = paymentMethod === 'CARD' ? 0.05 : 0.15; 
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      const orderPayload = {
        subtotal,
        taxAmount,
        totalAmount: total,
        paymentMethod,
        items: cart.map(item => ({
          name: item.name,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post('http://localhost:3000/api/orders', orderPayload);
      setLastOrder({ ...orderPayload, id: response.data.id });
      setShowReceipt(true);
      toast.success(`Sale Processed!`);
      setCart([]);
    } catch (err) {
      toast.error("Checkout failed.");
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'all' || p.categoryId === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      
      {/* CATALOG AREA */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search menu..."
              className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-pink-500/5 font-bold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-600" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <button 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-3 rounded-[2.2rem] border border-slate-100 hover:border-pink-500 hover:shadow-xl transition-all text-left group flex flex-col h-full"
                >
                  <div className="h-48 w-full rounded-[1.8rem] overflow-hidden mb-3">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="px-2 pb-2">
                    <p className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{product.category?.name || product.category || 'General'}</p>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1 italic uppercase tracking-tighter">{product.name}</h3>
                    <p className="font-black text-slate-900 mt-2">₨ {product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHECKOUT CARD */}
      <div className="w-full lg:w-105 flex flex-col bg-slate-900 rounded-[3rem] text-white p-8 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-pink-500" size={20} />
          <h2 className="text-xl font-black uppercase tracking-tight italic">Checkout</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-24 opacity-20">
              <ReceiptText className="mx-auto mb-4" size={48} />
              <p className="font-bold text-xs uppercase tracking-[0.2em]">Cart is Empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <p className="font-bold text-sm truncate w-32 uppercase tracking-tighter">{item.name}</p>
                  <p className="text-[10px] font-bold text-pink-500">₨ {item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white/10 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded-lg text-pink-500"><Minus size={14}/></button>
                    <span className="px-3 font-black text-xs tabular-nums">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1 hover:bg-white/10 rounded-lg text-pink-500"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaymentMethod('CASH')}
              className={`flex flex-col items-center gap-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all border-2 ${paymentMethod === 'CASH' ? 'bg-white text-slate-900 border-white shadow-lg' : 'border-white/10 text-white/40'}`}
            >
              <Banknote size={18} /> CASH (15%)
            </button>
            <button 
              onClick={() => setPaymentMethod('CARD')}
              className={`flex flex-col items-center gap-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all border-2 ${paymentMethod === 'CARD' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-600/20' : 'border-white/10 text-white/40'}`}
            >
              <CreditCard size={18} /> CARD (5%)
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <span>Subtotal</span>
              <span>₨ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">
              <span>GST ({taxRate * 100}%)</span>
              <span>₨ {taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-3xl font-black pt-3 border-t border-white/5">
              <span className="italic">Total</span>
              <span className="text-pink-500 tabular-nums">₨ {Math.round(total).toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-900/20"
          >
            {processing ? <Loader2 className="animate-spin" size={18} /> : 'Process Payment'}
          </button>
        </div>
      </div>

      <ReceiptModal 
        isOpen={showReceipt} 
        onClose={() => setShowReceipt(false)} 
        orderData={lastOrder} 
      />
    </div>
  );
};

export default POS;