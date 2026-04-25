import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Minus, Trash2, CreditCard, 
  Banknote, ReceiptText, ShoppingBag, Loader2, 
  UserCircle, Tag, Ticket
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
  prepTime: number;
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

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, custRes] = await Promise.allSettled([
        axios.get('http://localhost:3000/api/products'),
        axios.get('http://localhost:3000/api/categories'),
        axios.get('http://localhost:3000/api/customers')
      ]);

      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
      
      if (custRes.status === 'fulfilled') {
        const custData = custRes.value.data;
        setCustomers(custData);
        const walkIn = custData.find((c: any) => c.name?.toLowerCase().includes('walk-in'));
        if (walkIn) setSelectedCustomer(walkIn);
      } else {
        toast.error("Customer sync failed");
      }

      if (prodRes.status === 'rejected') toast.error("Product sync failed");
    } catch (err) {
      toast.error("Telemetry Stream Failure");
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
  
  const couponDiscount = appliedCoupon 
    ? (appliedCoupon.discountType === 'PERCENT' ? (subtotal * (appliedCoupon.discountValue / 100)) : appliedCoupon.discountValue)
    : 0;

  const total = Math.max(0, subtotal + taxAmount - discount - couponDiscount);

  const applyCoupon = async () => {
    if (!couponInput) return;
    try {
      const res = await axios.post('http://localhost:3000/api/coupons/validate', {
        code: couponInput,
        totalAmount: subtotal
      });
      setAppliedCoupon(res.data);
      toast.success(`Coupon Applied: RS ${res.data.discountValue}${res.data.discountType === 'PERCENT' ? '%' : ''}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid Coupon");
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    const maxPrepTime = Math.max(...cart.map(item => item.prepTime || 5));
    const estimatedTime = new Date(Date.now() + maxPrepTime * 60000);

    try {
      const orderPayload = {
        subtotal,
        taxAmount,
        discount: discount + couponDiscount,
        totalAmount: total,
        paymentMethod,
        estimatedTime,
        customerId: selectedCustomer?.id,
        couponId: appliedCoupon?.id,
        items: cart.map(item => ({
          name: item.name,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post('http://localhost:3000/api/orders', orderPayload);
      setLastOrder({ ...orderPayload, id: response.data.id, customer: selectedCustomer });
      setShowReceipt(true);
      toast.success(`Protocol Successful: Total PKR ${Math.round(total)}`);
      setCart([]);
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponInput('');
    } catch (err) {
      toast.error("Critical Checkout Failure");
    } finally {
      setProcessing(false);
    }
  };

  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'all' || p.categoryId === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full h-full flex gap-8 theme-transition overflow-hidden">

      {/* CATALOG SYSTEM */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col gap-5 mb-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase italic">Sales Menu</h2>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mt-1.5">Manage and select products for the current order</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-panel border-2 border-border-oftsy rounded-2xl px-5 py-3 flex items-center gap-4 group">
                <UserCircle className="text-text-muted group-hover:text-brand transition-all" size={20} />
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value))}
                  className="bg-transparent outline-none font-black text-[10px] uppercase tracking-widest text-text-main"
                >
                  {customers.map(c => <option key={c.id} value={c.id} className="bg-surface text-text-main">{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-surface border-2 border-border-oftsy rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-brand font-black text-xs tracking-wide transition-all placeholder:text-text-muted/40 uppercase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border-2 ${activeCategory === 'all' ? 'bg-brand text-white border-brand shadow-glow' : 'bg-surface text-text-muted border-border-oftsy hover:border-brand'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border-2 whitespace-nowrap ${activeCategory === cat.id ? 'bg-brand text-white border-brand shadow-glow' : 'bg-surface text-text-muted border-border-oftsy hover:border-brand'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mapped Catalog Nodes */}
        <div className="flex-1 overflow-y-auto pr-3 no-scrollbar relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
              <Loader2 className="animate-spin text-brand mb-5" size={48} />
              <p className="font-black text-[10px] uppercase tracking-widest text-text-main">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 border-2 border-dashed border-border-oftsy rounded-[3rem]">
              <ShoppingBag size={64} className="mb-4" />
              <p className="font-black text-xs uppercase tracking-[0.4em]">No Products Found</p>
              <p className="text-[9px] font-bold uppercase mt-2">Try adjusting your search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="industrial-card p-3 rounded-[2rem] group flex flex-col h-full border-2 border-white/5 hover:border-brand/40 transition-all"
                >
                  <div className="h-36 w-full rounded-2xl overflow-hidden mb-3 relative">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-text-main shadow-lg">₨ {product.price}</div>
                  </div>
                  <div className="px-1 pb-1 text-left">
                    <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em] mb-1">{product.category?.name || 'General'}</p>
                    <h3 className="font-black text-base text-text-main uppercase tracking-tighter italic leading-none">{product.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECURE TERMINAL (Cart & Payment) */}
      <div className="w-[400px] flex flex-col bg-text-main rounded-[2.5rem] text-white p-8 shadow-glow overflow-hidden relative border-2 border-brand/20 z-50">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-10 shrink-0">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shadow-glow">
            <ShoppingBag size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Current Order</h2>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Checkout session</p>
          </div>
        </div>

        {/* Live Cart Array */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-3 no-scrollbar font-mono">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-10 py-8">
              <ReceiptText className="mb-4" size={64} />
              <p className="font-black text-[9px] uppercase tracking-[0.4em]">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-brand/30 transition-all group">
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tighter italic group-hover:text-brand transition-colors">{item.name}</p>
                  <p className="text-[10px] font-black text-white/40 mt-1 uppercase tracking-widest">₨ {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-brand rounded-lg transition-all"><Minus size={14} /></button>
                    <span className="px-3 font-black text-base tabular-nums italic">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1.5 hover:bg-brand rounded-lg transition-all"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-brand transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Computation */}
        <div className="space-y-5 shrink-0 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl font-black text-[9px] tracking-[0.3em] transition-all border-2 ${paymentMethod === 'CASH' ? 'bg-white text-text-main border-white shadow-glow' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
            >
              <Banknote size={20} /> CASH (15%)
            </button>
            <button
              onClick={() => setPaymentMethod('CARD')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl font-black text-[9px] tracking-[0.3em] transition-all border-2 ${paymentMethod === 'CARD' ? 'bg-brand text-white border-brand shadow-glow' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
            >
              <CreditCard size={20} /> CARD (5%)
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3 font-mono">
            {/* Coupon Protocol */}
            <div className="flex gap-3 mb-2">
              <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 group focus-within:border-brand transition-all flex items-center gap-3">
                <Ticket size={16} className="text-brand opacity-40 group-focus-within:opacity-100 transition-all" />
                <input 
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="bg-transparent outline-none font-black text-[10px] uppercase tracking-widest text-white flex-1"
                  placeholder="Redeem Voucher..."
                />
              </div>
              <button 
                onClick={applyCoupon}
                className="px-6 bg-white/10 hover:bg-brand rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
              >
                APPLY
              </button>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center bg-brand/10 p-3 rounded-xl border border-brand/20 animate-pulse mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand" />
                  <span className="text-[9px] font-black uppercase text-brand">Voucher Alpha: {appliedCoupon.code} (-₨ {Math.round(couponDiscount)})</span>
                </div>
                <button onClick={() => setAppliedCoupon(null)} className="text-[8px] font-black text-brand/60 hover:text-brand uppercase">Remove</button>
              </div>
            )}

            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group focus-within:border-brand transition-all">
               <div className="flex items-center gap-3">
                  <Tag size={16} className="text-brand opacity-40 group-focus-within:opacity-100 transition-all" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Manual Adj.</span>
               </div>
               <input 
                 type="number"
                 value={discount || ''}
                 onChange={(e) => setDiscount(Number(e.target.value))}
                 className="bg-transparent text-right outline-none font-black text-sm tabular-nums w-24 text-brand"
                 placeholder="0.00"
               />
            </div>
            <div className="flex justify-between text-3xl font-black pt-4 border-t border-white/10 tracking-tighter">
              <span className="italic uppercase opacity-30 text-[10px] mt-2">Total Due</span>
              <span className="text-brand tabular-nums">₨ {Math.round(total).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-brand hover:scale-[1.01] active:scale-100 disabled:opacity-20 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-glow"
          >
            {processing ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <CreditCard size={18} />
                Place Order
              </>
            )}
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