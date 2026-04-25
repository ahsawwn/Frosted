import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChefHat, Clock, AlertCircle, CheckCircle2, 
  Loader2, RefreshCw, ArrowRight,
  Flame
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
}

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  items: OrderItem[];
  createdAt: string;
}

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders/active');
      setOrders(res.data);
    } catch (err) {
      toast.error("KDS Stream Interrupted");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Protocol Updated: ${status}`);
    } catch (err) {
      toast.error("Status Mutation Failed");
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: KITCHEN DISPLAY SYSTEM */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              Oftsy <span className="text-brand">KDS</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Kitchen Display System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-6 px-8 py-4 bg-panel border-2 border-border-oftsy rounded-2xl">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                 <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{orders.filter(o => o.status === 'PENDING').length} PENDING</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-border-oftsy" />
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{orders.filter(o => o.status === 'PREPARING').length} PREPARING</span>
              </div>
           </div>
           <button onClick={fetchOrders} className="p-4 bg-brand text-white rounded-2xl shadow-glow hover:rotate-180 transition-all duration-700">
              <RefreshCw size={20} />
           </button>
        </div>
      </div>

      {/* ACTIVE ORDERS GRID */}
      <div className="flex-1 overflow-x-auto no-scrollbar pb-6 relative">
         {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-[2.5rem]">
               <Loader2 className="animate-spin text-brand" size={48} />
            </div>
         )}
         <div className="flex gap-6 h-full min-w-max">
            {['PENDING', 'PREPARING', 'READY'].map((status) => (
               <div key={status} className="w-[450px] flex flex-col space-y-4">
                  <div className={`p-5 rounded-[2rem] border-2 flex items-center justify-between ${
                     status === 'PENDING' ? 'bg-brand/10 border-brand/20 text-brand' :
                     status === 'PREPARING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                     'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                     <div className="flex items-center gap-3">
                        {status === 'PENDING' ? <AlertCircle size={20} /> : status === 'PREPARING' ? <Flame size={20} /> : <CheckCircle2 size={20} />}
                        <h2 className="text-sm font-black uppercase tracking-[0.3em]">{status} NODE</h2>
                     </div>
                     <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black">
                        {orders.filter(o => o.status === status).length}
                     </span>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                     {orders.filter(o => o.status === status).map(order => (
                        <div key={order.id} className="industrial-card p-6 rounded-[2.5rem] border-2 border-white/5 space-y-5 animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden group">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em]">Ticket_{order.id.slice(-6).toUpperCase()}</p>
                                 <p className="text-[10px] font-black text-text-muted mt-1 uppercase flex items-center gap-2"><Clock size={12} className="text-brand" /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                              <button onClick={() => updateStatus(order.id, status === 'PENDING' ? 'PREPARING' : status === 'PREPARING' ? 'READY' : 'COMPLETED')} className={`px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                                 status === 'PENDING' ? 'bg-brand text-white' : status === 'PREPARING' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                              } hover:scale-105 active:scale-95 shadow-glow`}>
                                 Next_Phase <ArrowRight size={14} className="inline ml-1" />
                              </button>
                           </div>

                           <div className="p-4 bg-panel/30 rounded-2xl border border-white/5">
                              {order.items.map(item => (
                                 <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 font-mono">
                                    <span className="text-[11px] font-black text-text-main uppercase">{item.product.name}</span>
                                    <span className="bg-brand/20 text-brand px-2 py-0.5 rounded text-[10px] font-black">x{item.quantity}</span>
                                 </div>
                              ))}
                           </div>

                           {/* Bottom Indicator */}
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Kitchen;
