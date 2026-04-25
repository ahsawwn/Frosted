import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Monitor, ShoppingBag, Sparkles, 
  CreditCard, Utensils, Heart 
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CustomerScreen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  const fetchLiveOrder = async () => {
    try {
      // Mocking live sync - in production this would be a WebSocket or SSE
      const res = await axios.get('http://localhost:3000/api/current-order-sync');
      setCart(res.data.items);
      setTotals(res.data.totals);
    } catch (err) {
      // Quiet fail to maintain UI clean state
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchLiveOrder, 1000); // 1s sync for real-time feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0b] text-white flex overflow-hidden font-lexend">
      
      {/* LEFT: LIVE BILLING BOARD */}
      <div className="w-[60%] flex flex-col p-12 border-r-2 border-white/5 relative">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-glow">
              <ShoppingBag size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic italic">Live <span className="text-brand">Order</span></h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mt-2">Your order live status</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-4">
           {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8">
                 <Utensils size={120} />
                 <p className="text-xl font-black uppercase tracking-[0.6em]">Your cart is empty</p>
              </div>
           ) : cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/5 animate-in slide-in-from-left-8 duration-500">
                 <div className="flex items-center gap-6">
                    <div className="w-4 h-4 rounded-full bg-brand shadow-glow" />
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic">{item.name}</h3>
                       <p className="text-xs font-black text-white/30 uppercase tracking-widest mt-1">₨ {item.price} each</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-black text-brand italic">x{item.quantity}</p>
                    <p className="text-sm font-black text-white/60 mt-1 uppercase tracking-widest">₨ {item.price * item.quantity}</p>
                 </div>
              </div>
           ))}
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-brand/5 to-transparent pointer-events-none" />
      </div>

      {/* RIGHT: COMMAND SUMMARY */}
      <div className="w-[40%] bg-surface/30 backdrop-blur-3xl flex flex-col p-12 justify-between">
         <div className="space-y-12">
            <div className="flex items-center justify-between">
               <Monitor className="text-brand opacity-40" size={32} />
               <div className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure_Channel</span>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-black italic">₨ {totals.subtotal}</span>
               </div>
               <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-black uppercase tracking-widest">Tax (GST)</span>
                  <span className="text-lg font-black italic">₨ {totals.tax}</span>
               </div>
               <div className="flex justify-between items-center text-brand">
                  <span className="text-xs font-black uppercase tracking-widest">Discount</span>
                  <span className="text-lg font-black italic">- ₨ {totals.discount}</span>
               </div>
               <div className="h-0.5 bg-white/10 w-full" />
               <div className="flex justify-between items-end py-6">
                  <div>
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Amount Payable</p>
                     <h2 className="text-7xl font-black tracking-tighter italic leading-none">₨ {totals.total}</h2>
                  </div>
                  <Sparkles className="text-brand animate-pulse" size={48} />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 bg-brand rounded-[2.5rem] shadow-glow flex items-center justify-between group overflow-hidden relative">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">Scan & Verify</p>
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">Pay at Counter</h4>
               </div>
               <CreditCard size={48} className="relative z-10 opacity-60 group-hover:scale-110 transition-all" />
               <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>

            <div className="text-center opacity-20">
               <Heart className="inline mb-2" size={24} />
               <p className="text-[9px] font-black uppercase tracking-[0.5em]">Thank you for choosing Oftsy Creamery</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CustomerScreen;
