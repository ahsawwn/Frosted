import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, Users, Package, ShoppingCart, 
  Clock, Calendar, ArrowRight, Activity, RefreshCw,
  Database, ShieldCheck, Thermometer, Flame, 
  IceCream, PieChart, Timer, Star
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, lowStockCount: 0, staffCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, stockRes, staffRes, activityRes] = await Promise.all([
        axios.get('http://localhost:3000/api/stats/sales-summary'),
        axios.get('http://localhost:3000/api/stats/low-stock-count'),
        axios.get('http://localhost:3000/api/stats/staff-count'),
        axios.get('http://localhost:3000/api/orders')
      ]);

      setStats({
        totalSales: statsRes.data.totalAmount || 0,
        orderCount: statsRes.data.count || 0,
        lowStockCount: stockRes.data.count || 0,
        staffCount: staffRes.data.count || 0
      });
      setRecentOrders(activityRes.data.slice(0, 6)); 
    } catch (err) {
      toast.error("Shop Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="w-full max-w-[1850px] mx-auto px-8 py-2 space-y-4 animate-in fade-in duration-500 overflow-hidden">
      
      {/* 1. SHOP HEADER */}
      <div className="flex justify-between items-center bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500 rounded-2xl text-white shadow-lg shadow-pink-100">
            <IceCream size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Oftsy <span className="text-pink-500">Creamery</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sarai Alamgir Shard • POS Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           {/* Real-time Status Indicators */}
           <div className="hidden xl:flex items-center gap-6 border-r border-slate-100 pr-8">
              <StatusBadge icon={<Thermometer size={14} className="text-blue-500" />} label="Freezer" value="-18°C" />
              <StatusBadge icon={<Timer size={14} className="text-amber-500" />} label="Avg Service" value="3.2m" />
           </div>
          <div className="text-right">
            <p className="text-lg font-black text-slate-900 tabular-nums leading-none">{format(currentTime, 'pp')}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{format(currentTime, 'eeee, MMM do')}</p>
          </div>
          <button onClick={fetchDashboardData} className="bg-slate-50 p-3 rounded-xl text-slate-400 hover:text-pink-500 transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. CORE SHOP METRICS (6 Cards for 1920p width) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
        <MetricCard label="Revenue" value={`₨ ${stats.totalSales.toLocaleString()}`} icon={<TrendingUp />} color="pink" trend="+15%" />
        <MetricCard label="Tickets" value={stats.orderCount.toString()} icon={<ShoppingCart />} color="slate" trend="+8" />
        <MetricCard label="Operators" value={stats.staffCount.toString()} icon={<Users />} color="emerald" trend="Live" />
        <MetricCard label="Low Tubs" value={stats.lowStockCount.toString()} icon={<Package />} color="red" alert={stats.lowStockCount > 0} trend="Stock" />
        <MetricCard label="Freezer" value="-18.4°C" icon={<Thermometer />} color="blue" trend="Stable" />
        <MetricCard label="Peak Index" value="High" icon={<Flame />} color="amber" trend="Now" />
      </div>

      {/* 3. ACTIVITY & ANALYTICS SPLIT */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* LIVE SALES STREAM */}
        <div className="col-span-12 xl:col-span-8 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col h-[480px]">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
              <Activity size={18} className="text-pink-500" /> Sales Ledger
            </h3>
            <div className="flex gap-2">
               <div className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Shard Syncing</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-[#FFF9FB]/30 hover:bg-white border border-transparent hover:border-pink-50 rounded-[2rem] transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-300 group-hover:text-pink-500 transition-all">
                    #{order.id.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-base text-slate-900 leading-none">₨ {order.totalAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">
                      {order.items?.[0]?.product?.name || 'Assorted Scoop'} • {order.paymentMethod || 'Cash'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-900 tabular-nums">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                  <p className="text-[8px] text-pink-500 font-black uppercase mt-0.5 tracking-tighter">Kitchen Notified</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHOP INTELLIGENCE (Sidebar) */}
        <div className="col-span-12 xl:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between h-[480px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl pointer-events-none" />
           
           <div>
              <div className="flex items-center justify-between mb-10">
                <PieChart className="text-pink-500" size={28} />
                <h3 className="text-lg font-black uppercase tracking-tighter italic">Shop Intel</h3>
              </div>
              
              <div className="space-y-8">
                 <FlavorMetric label="Belgian Chocolate" sales={84} color="bg-amber-900" />
                 <FlavorMetric label="Vanilla Bean" sales={65} color="bg-slate-50" />
                 <FlavorMetric label="Pistachio" sales={42} color="bg-emerald-400" />
                 <FlavorMetric label="Strawberry Blush" sales={38} color="bg-pink-400" />
              </div>
           </div>

           <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-5">
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Top Operator</p>
                    <p className="text-sm font-black italic">Ahsan S.</p>
                 </div>
                 <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
              </div>
              <button className="w-full py-4 bg-pink-500 hover:bg-white hover:text-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-pink-900/20">
                Generate Daily Audit
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- CREAMERY HELPERS ---

const StatusBadge = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{label}</p>
      <p className="text-[11px] font-black text-slate-900 uppercase tabular-nums">{value}</p>
    </div>
  </div>
);

const MetricCard = ({ label, value, icon, color, alert, trend }: any) => {
  const themes: any = {
    pink: 'bg-pink-500 text-white shadow-pink-100',
    blue: 'bg-blue-500 text-white shadow-blue-100',
    emerald: 'bg-emerald-500 text-white shadow-emerald-100',
    red: 'bg-red-500 text-white shadow-red-100',
    amber: 'bg-amber-500 text-white shadow-amber-100',
    slate: 'bg-slate-900 text-white shadow-slate-100'
  };

  return (
    <div className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm relative group h-32 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl shadow-md ${themes[color]}`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100">
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tabular-nums tracking-tight">{value}</h3>
      </div>
      {alert && <div className="absolute top-5 right-12 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />}
    </div>
  );
};

const FlavorMetric = ({ label, sales, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-white italic">{sales}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${sales}%` }} />
    </div>
  </div>
);

export default Home;