import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  ShoppingBag, Sparkles, CreditCard, 
  Heart, CheckCircle2, 
  RefreshCcw, Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
  const [status, setStatus] = useState<'IDLE' | 'ORDERING' | 'THANK_YOU'>('IDLE');

  const fetchLiveOrder = async () => {
    try {
      const res = await api.get('/customer-display/current');
      setCart(res.data.items);
      setTotals(res.data.totals);
      setStatus(res.data.status);
    } catch (err) {
       // Fail silently to keep UI clean
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchLiveOrder, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0b] text-white overflow-hidden font-lexend select-none">
      
      {/* IMMERSIVE CINEMATIC BACKGROUND */}
      <div className="absolute inset-0">
        <img 
          src="/customer-bg.png" 
          alt="Premium Creamery" 
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${status !== 'IDLE' ? 'scale-110 blur-sm opacity-40' : 'scale-100 opacity-60'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b]/60" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-row p-12 gap-12">
        
        {/* LEFT: BRANDING & WELCOME */}
        <div className={`flex-1 flex flex-col justify-center transition-all duration-1000 ${status === 'IDLE' ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none absolute'}`}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full">
              <Sparkles className="text-brand" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Artesian Experience</span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-none">
              Welcome to <br />
              <span className="text-brand">frosted</span> <span className="text-white/20">Creamery</span>
            </h1>
            <p className="text-xl text-white/40 max-w-xl font-medium leading-relaxed">
              Indulge in our hand-crafted treats. Every scoop tells a story of passion and premium ingredients.
            </p>
            <div className="flex gap-8 pt-8">
               <div className="flex flex-col gap-2">
                  <Clock className="text-brand" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Fast Service</span>
               </div>
               <div className="flex flex-col gap-2">
                  <Heart className="text-brand" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Made with Love</span>
               </div>
               <div className="flex flex-col gap-2">
                  <RefreshCcw className="text-brand" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Always Fresh</span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE ORDER TRACKER */}
        <div className={`w-[500px] flex flex-col glass-panel rounded-[3rem] border-white/10 shadow-2xl overflow-hidden transition-all duration-700 ${status === 'IDLE' ? 'translate-x-24 opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div className="p-10 shrink-0 border-b border-white/5">
             <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Your Order</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Sync</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Transaction in progress</p>
          </div>

          <div className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-6">
             {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group animate-in slide-in-from-right-8 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-brand italic">
                        x{item.quantity}
                      </div>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">{item.name}</h3>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1.5">₨ {item.price.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-white italic">₨ {(item.price * item.quantity).toLocaleString()}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="p-10 bg-white/5 space-y-6">
             <div className="space-y-3">
                <div className="flex justify-between items-center opacity-40 text-xs font-black uppercase tracking-widest">
                   <span>Subtotal</span>
                   <span>₨ {totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center opacity-40 text-xs font-black uppercase tracking-widest">
                   <span>Tax & Duty</span>
                   <span>₨ {totals.tax.toLocaleString()}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between items-center text-brand text-xs font-black uppercase tracking-widest">
                    <span>Loyalty Discount</span>
                    <span>- ₨ {totals.discount.toLocaleString()}</span>
                  </div>
                )}
             </div>

             <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Grand Total</p>
                      <h2 className="text-6xl font-black tracking-tighter italic leading-none text-brand">
                        <span className="text-2xl mr-2">₨</span>
                        {Math.round(totals.total).toLocaleString()}
                      </h2>
                   </div>
                   <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-glow">
                      <QRCodeSVG value={`PAYMENT:${totals.total}`} size={80} level="H" />
                   </div>
                </div>
             </div>

             <div className="mt-8 p-6 bg-brand rounded-3xl flex items-center justify-between group overflow-hidden relative shadow-glow cursor-pointer">
                <div className="relative z-10">
                   <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em] mb-1.5">Instant Checkout</p>
                   <h4 className="text-xl font-black uppercase italic tracking-tighter">Pay at Counter</h4>
                </div>
                <CreditCard size={32} className="relative z-10 opacity-80 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
             </div>
          </div>
        </div>

        {/* REFINED OVERLAY FOR THANK YOU STATE */}
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]/90 backdrop-blur-xl transition-all duration-700 ${status === 'THANK_YOU' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <div className="text-center space-y-8 max-w-2xl px-12">
              <div className="w-32 h-32 bg-brand rounded-[3rem] flex items-center justify-center shadow-glow mx-auto mb-10 animate-kiosk-entry">
                 <CheckCircle2 size={64} className="text-white" />
              </div>
              <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">
                 Order <span className="text-brand">Confirmed!</span>
              </h1>
              <p className="text-xl text-white/40 font-medium">
                 Thank you for choosing frosted. Your treat is being prepared with clinical precision and artisan love.
              </p>
              <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-4">Estimated Ready Time</p>
                 <h2 className="text-4xl font-black italic text-brand">5 - 7 Minutes</h2>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] pt-12">frosted CREAEMERY REDEFINED</p>
           </div>
        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center opacity-30 select-none">
         <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Terminal 01_Customer_Node</span>
         </div>
         <div className="text-[9px] font-black uppercase tracking-[0.5em]">
            &copy; 2026 frosted SYSTEMS ERP v5.0.2
         </div>
      </div>

    </div>
  );
};

export default CustomerScreen;

