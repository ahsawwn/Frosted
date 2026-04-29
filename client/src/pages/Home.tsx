import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  TrendingUp, Users, ShoppingCart, 
  ArrowRight, Activity, RefreshCw,
  Database, Thermometer, PieChart, Timer, Star, Boxes
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"role": "ADMIN"}');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, lowStockCount: 0, staffCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, stockRes, activityRes] = await Promise.all([
        api.get('/stats/sales-summary'),
        api.get('/stats/low-stock-count'),
        api.get('/orders')
      ]);

      setStats({
        totalSales: statsRes.data.totalAmount || 0,
        orderCount: statsRes.data.count || 0,
        lowStockCount: stockRes.data.count || 0,
        staffCount: activityRes.data.length || 0 
      });
      setRecentOrders(activityRes.data.slice(0, 10)); 
    } catch (err) {
      toast.error("Telemetry Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-5 theme-transition overflow-hidden">
      
      {/* 1. KIOSK HUD: STATUS & TIME */}
      <div className="flex justify-between items-center glass-panel p-5 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow animate-pulse">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              frosted <span className="text-brand">Hub</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
              Terminal Alpha-9 • System Nominal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="hidden xl:flex items-center gap-8 border-r-2 border-border-frosted pr-10">
              <StatusBadge icon={<Thermometer size={16} className="text-brand" />} label="Freezer" value="-18.1°C" />
              <StatusBadge icon={<Timer size={16} className="text-brand" />} label="Process" value="12ms" />
           </div>
          <div className="text-right">
            <p className="text-2xl font-black text-text-main tabular-nums leading-none tracking-tighter">{format(currentTime, 'pp')}</p>
            <p className="text-[9px] font-black text-text-muted uppercase mt-1.5 tracking-[0.2em] opacity-60">{format(currentTime, 'eeee, MMM do')}</p>
          </div>
          <button onClick={fetchDashboardData} className="bg-panel p-3 rounded-xl text-text-muted hover:text-brand transition-all border-2 border-border-frosted">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. INDUSTRIAL METRIC GRID */}
      <div className={`grid gap-5 shrink-0 ${
        ['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(user.role) ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'
      }`}>
        {['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'].includes(user.role) && (
          <MetricCard label="Sales Today" value={`₨ ${stats.totalSales.toLocaleString()}`} icon={<TrendingUp />} trend="+10.2%" />
        )}
        {['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'].includes(user.role) && (
          <MetricCard label="Orders Today" value={stats.orderCount.toString()} icon={<ShoppingCart />} trend="Active" />
        )}
        {['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN'].includes(user.role) && (
          <MetricCard label="Staff on Duty" value={stats.staffCount.toString()} icon={<Users />} trend="Active" />
        )}
        {['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN'].includes(user.role) && (
          <MetricCard label="Low Stock Alerts" value={stats.lowStockCount.toString()} icon={<Boxes />} alert={stats.lowStockCount > 0} trend="Check Inventory" />
        )}
      </div>

      {/* 3. TERMINAL STREAM & ANALYTICS */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        
        {/* LEDGER STREAM */}
        <div className="col-span-8 industrial-card p-8 flex flex-col min-h-0 border-2 border-white/5">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-base font-black text-text-main uppercase tracking-widest flex items-center gap-3 italic font-mono">
              <Database size={20} className="text-brand" /> Recent Sales
            </h3>
            <div className="flex bg-panel px-3 py-1.5 rounded-full border border-border-frosted items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
               <span className="text-[9px] font-black text-text-muted uppercase tracking-widest font-mono">Live updates</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-4 no-scrollbar font-mono">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className="flex items-center justify-between p-5 bg-panel/50 hover:bg-surface border-2 border-transparent hover:border-brand/30 rounded-[2rem] transition-all group scale-100 hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface rounded-xl border-2 border-border-frosted flex items-center justify-center font-black text-[10px] text-text-muted group-hover:text-brand group-hover:border-brand transition-all shadow-sm">
                    {order.id.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-xl text-text-main tracking-tighter leading-none">₨ {order.totalAmount.toLocaleString()}</p>
                    <p className="text-[9px] text-text-muted font-black uppercase mt-1.5 tracking-widest opacity-60">
                      {order.items?.[0]?.product?.name || 'General Sale'} {order.items?.length > 1 && `+${order.items.length - 1}`} • {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-main tabular-nums tracking-tighter opacity-80">{format(new Date(order.createdAt), 'HH:mm:ss')}</p>
                   <ArrowRight size={14} className="text-brand ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM INTELLIGENCE */}
        <div className="col-span-4 bg-text-main/95 rounded-[2.5rem] p-8 text-white shadow-glow flex flex-col border-2 border-brand/20 relative overflow-hidden">
           <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand/10 blur-[80px] pointer-events-none" />
           
           <div className="shrink-0 mb-8">
              <div className="flex items-center justify-between mb-1.5">
                <PieChart className="text-brand" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tighter italic font-mono">Today's Trends</h3>
              </div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Sales performance</p>
           </div>
              
           <div className="flex-1 space-y-7 min-h-0 overflow-y-auto no-scrollbar">
              <FlavorMetric label="High Intensity Cocoa" sales={88} color="bg-brand" />
              <FlavorMetric label="Vanilla Extraction" sales={65} color="bg-white/40" />
              <FlavorMetric label="Pistachio Roast" sales={42} color="bg-emerald-500" />
              <FlavorMetric label="Berry Fusion" sales={32} color="bg-brand/60" />
           </div>

           <div className="shrink-0 mt-8 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Staff on duty</p>
                    <p className="text-base font-black italic uppercase tracking-tighter">Ahsan S.</p>
                 </div>
                 <div className="flex text-brand"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
              </div>
              <button className="w-full py-4 bg-brand hover:scale-[1.02] active:scale-100 text-white font-black text-[9px] uppercase tracking-[0.4em] rounded-2xl transition-all shadow-glow">
                Save Report
              </button>
           </div>
        </div>
      </div>

      {/* TRANSACTION OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-3xl z-[100] flex items-center justify-end p-5 font-mono animate-in slide-in-from-right-full duration-700">
           <div className="w-full max-w-xl h-full bg-surface rounded-[3.5rem] shadow-glow border-l-4 border-brand p-12 flex flex-col overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] pointer-events-none" />
              
              <div className="flex justify-between items-start mb-16 relative z-10">
                 <div>
                    <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter italic">Sale Details</h2>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] mt-3">Order Code: {selectedOrder.id.toUpperCase()}</p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-4 bg-panel rounded-[1.5rem] text-text-muted hover:text-brand transition-all border-2 border-border-frosted">
                    <Activity size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-12 relative z-10">
                 <div className="space-y-6">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] border-b-2 border-border-frosted pb-4">Items Ordered</p>
                    {selectedOrder.items?.map((item: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center group">
                          <div>
                             <p className="text-xl font-black text-text-main uppercase tracking-tighter italic">{item.product?.name || item.name}</p>
                             <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest">Qty: {item.quantity} • ₨ {item.price}/unit</p>
                          </div>
                          <p className="text-xl font-black text-brand italic">₨ {item.quantity * item.price}</p>
                       </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-panel/50 rounded-[2.5rem] border-2 border-border-frosted">
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-3">Payment</p>
                       <p className="text-xl font-black text-text-main uppercase italic">{selectedOrder.paymentMethod || 'Manual'}</p>
                    </div>
                    <div className="p-8 bg-panel/50 rounded-[2.5rem] border-2 border-border-frosted text-right">
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-3">Time</p>
                       <p className="text-xl font-black text-text-main tabular-nums italic">{format(new Date(selectedOrder.createdAt), 'HH:mm:ss')}</p>
                    </div>
                 </div>

                 <div className="space-y-4 pt-10 border-t-2 border-dashed border-border-frosted">
                    <div className="flex justify-between text-[11px] font-black text-text-muted uppercase tracking-widest">
                       <span>Subtotal</span>
                       <span>₨ {selectedOrder.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-brand uppercase tracking-widest">
                       <span>Tax</span>
                       <span>₨ {selectedOrder.taxAmount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-5xl font-black text-text-main tracking-tighter italic pt-6">
                       <span className="text-[10px] uppercase opacity-30 mt-4 leading-none">Total Paid</span>
                       <span>₨ {selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-16 py-8 bg-text-main text-surface rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-glow hover:bg-brand transition-all relative z-10"
              >
                Close Details
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-panel rounded-xl border-2 border-border-frosted">{icon}</div>
    <div>
      <p className="text-[7.5px] font-black text-text-muted uppercase tracking-[0.3em] leading-none mb-1.5">{label}</p>
      <p className="text-sm font-black text-text-main uppercase tabular-nums tracking-tighter">{value}</p>
    </div>
  </div>
);

const MetricCard = ({ label, value, icon, alert, trend }: any) => (
  <div className="industrial-card p-6 rounded-[2rem] relative group h-36 flex flex-col justify-between hover:border-brand border-2 border-white/5">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-brand rounded-xl text-white shadow-glow group-hover:scale-105 transition-transform duration-500">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="text-[9px] font-black text-brand bg-brand/5 px-3 py-1 rounded-full uppercase tracking-widest border border-brand/20">
        {trend}
      </div>
    </div>
    <div>
      <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5">{label}</p>
      <h3 className="text-2xl font-black text-text-main tabular-nums tracking-tighter">{value}</h3>
    </div>
    {alert && <div className="absolute top-6 right-14 h-2.5 w-2.5 rounded-full bg-brand animate-ping" />}
  </div>
);

const FlavorMetric = ({ label, sales, color }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] font-mono">
      <span className="text-white/40">{label}</span>
      <span className="text-white italic">{sales}%</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-glow`} style={{ width: `${sales}%` }} />
    </div>
  </div>
);

export default Home;
