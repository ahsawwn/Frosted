import { useState } from 'react';
import { 
  Truck, Clock, MapPin, 
  CheckCircle2, AlertCircle,
  PhoneCall, IndianRupee,
  Smartphone, Bike
} from 'lucide-react';

const Delivery = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED'>('PENDING');

  const orders = [
    {
      id: 'FP-8123',
      customer: 'Sarah Khan',
      address: 'House 42, Street 7, DHA Phase 5, Karachi',
      phone: '+92 300 1234567',
      items: ['Belgian Chocolate Scoop x2', 'Red Velvet Cone x1'],
      total: 1450,
      commission: 435, // 30% FP commission
      time: '12:45 PM',
      rider: { name: 'Irfan Ali', phone: '+92 312 9876543', status: 'Near Store' },
      status: 'PENDING'
    },
    {
      id: 'FP-8124',
      customer: 'Usman Ahmed',
      address: 'Clifton Block 4, Flat 202',
      phone: '+92 333 7654321',
      items: ['Vanilla Bean Pint x1'],
      total: 850,
      commission: 255,
      time: '01:10 PM',
      rider: null,
      status: 'PREPARING'
    }
  ];

  const stats = [
    { label: 'Today Orders', value: '42', icon: Truck, color: 'text-pink-500' },
    { label: 'Commission Lost', value: '₨ 12,400', icon: IndianRupee, color: 'text-rose-600' },
    { label: 'Avg Prep Time', value: '14 min', icon: Clock, color: 'text-emerald-500' },
  ];

  return (
    <div className="w-full h-full space-y-8 animate-kiosk-entry">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#D70F64] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Smartphone size={24} />
              </div>
              <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase italic">Foodpanda Pakistan</h2>
           </div>
           <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Operational node for external delivery logistics</p>
        </div>

        <div className="flex gap-4">
           {stats.map((stat, idx) => (
             <div key={idx} className="frosted-panel px-6 py-4 rounded-[2rem] flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-surface/50 border border-border-frosted ${stat.color}`}>
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black text-text-main italic">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* DELIVERY STATUS TABS */}
      <div className="flex gap-2">
         {['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((status) => (
           <button
             key={status}
             onClick={() => setActiveTab(status as any)}
             className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${activeTab === status ? 'bg-[#D70F64] text-white border-[#D70F64] shadow-glow' : 'bg-surface text-text-muted border-border-frosted hover:border-[#D70F64]'}`}
           >
             {status.replace(/_/g, ' ')}
           </button>
         ))}
      </div>

      {/* ORDER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
         {orders.filter(o => o.status === activeTab || activeTab === 'PENDING').map(order => (
           <div key={order.id} className="frosted-panel p-8 rounded-[3rem] border-2 border-white/5 hover:border-[#D70F64]/30 transition-all flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D70F64]/5 blur-[60px] group-hover:bg-[#D70F64]/10 transition-all" />
              
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface border-2 border-border-frosted rounded-2xl flex items-center justify-center font-bold text-[#D70F64] italic shadow-inner">
                       {order.id.split('-')[1]}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-text-main italic tracking-tighter uppercase leading-none">{order.customer}</h3>
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1.5 flex items-center gap-2">
                          <Clock size={12} className="text-[#D70F64]" /> Ordered at {order.time}
                       </p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-2xl font-black text-text-main italic leading-none text-brand">₨ {order.total.toLocaleString()}</p>
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-2 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                       VAT CUT: ₨ {order.commission}
                    </p>
                 </div>
              </div>

              <div className="h-[2px] bg-border-frosted w-full" />

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <MapPin size={12} className="text-[#D70F64]" /> Dropoff Location
                       </p>
                       <p className="text-xs font-bold text-text-main leading-relaxed">
                          {order.address}
                       </p>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 bg-surface border-2 border-border-frosted hover:border-[#D70F64] py-3 rounded-2xl flex items-center justify-center gap-2 transition-all group">
                          <PhoneCall size={16} className="text-[#D70F64]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Call Customer</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4 border-l-2 border-border-frosted pl-8">
                    <div>
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <Bike size={12} className="text-[#D70F64]" /> Rider Protocol
                       </p>
                       {order.rider ? (
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#D70F64]/10 rounded-xl flex items-center justify-center text-[#D70F64]">
                               <Bike size={20} />
                            </div>
                            <div>
                               <p className="text-xs font-black text-text-main uppercase italic">{order.rider.name}</p>
                               <p className="text-[9px] font-bold text-emerald-500 uppercase">{order.rider.status}</p>
                            </div>
                         </div>
                       ) : (
                         <div className="flex items-center gap-3 text-amber-500">
                            <AlertCircle size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Waiting for Rider Pairing...</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <button className="w-full bg-[#D70F64] hover:bg-[#b00d53] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-lg mt-2">
                 <CheckCircle2 size={16} />
                 Execute Dispatch Sequence
              </button>
           </div>
         ))}
      </div>

    </div>
  );
};

export default Delivery;

