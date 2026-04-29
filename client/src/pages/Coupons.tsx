import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Ticket, Plus, Search, Trash2, 
  X, Loader2, Calendar, Percent, 
  Hash, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  expiryDate?: string;
  minOrderValue?: number;
}

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    expiryDate: string;
    minOrderValue: number;
  }>({
    code: '',
    discountType: 'PERCENT',
    discountValue: 0,
    expiryDate: '',
    minOrderValue: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (err) {
      toast.error("Voucher Stream Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/coupons', formData);
      toast.success("Voucher Sequence Activated");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Voucher Encryption Failure");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm("TERMINATE_VOUCHER_SEQUENCE?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Voucher Revoked");
    } catch (err) {
      toast.error("Revocation Protocol Error");
    }
  };

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: VOUCHER CONTROLLER */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Ticket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              frosted <span className="text-brand">Vouchers</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5">Discount Protocol Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={18} />
            <input 
              type="text"
              placeholder="Query sequence..."
              className="bg-panel border-2 border-border-frosted rounded-2xl py-4 pl-14 pr-6 w-64 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setFormData({ code: '', discountType: 'PERCENT', discountValue: 0, expiryDate: '', minOrderValue: 0 }); setIsModalOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow transition-all border-2 border-brand/20"
          >
            <Plus size={18} /> Deploy_Sequence.bin
          </button>
        </div>
      </div>

      {/* VOUCHER GRID */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/50 backdrop-blur-sm rounded-[2.5rem]">
            <Loader2 className="animate-spin text-brand" size={48} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {filtered.map(c => (
            <div key={c.id} className="industrial-card p-6 rounded-[2.25rem] flex flex-col justify-between border-2 border-white/5 relative group overflow-hidden bg-panel/20">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-text-main rounded-xl flex items-center justify-center text-brand">
                        <Hash size={20} />
                     </div>
                     <div>
                        <p className="text-xl font-black text-text-main uppercase tracking-tighter italic">{c.code}</p>
                        <span className="text-[8px] font-black text-brand uppercase tracking-widest">Active_Sequence</span>
                     </div>
                  </div>
                  <button onClick={() => deleteCoupon(c.id)} className="p-2.5 bg-panel/50 rounded-xl text-text-muted hover:text-red-500 transition-all border border-border-frosted hover:border-red-500">
                     <Trash2 size={16} />
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        {c.discountType === 'PERCENT' ? <Percent size={16} className="text-brand" /> : <div className="text-brand font-black text-xs">₨</div>}
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Magnitude</p>
                     </div>
                     <p className="text-lg font-black text-text-main italic">{c.discountValue}{c.discountType === 'PERCENT' ? '%' : ''}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-brand" />
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Expiry</p>
                     </div>
                     <p className="text-[10px] font-black text-text-main">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Infinite'}</p>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center opacity-40">
                     <ShieldAlert size={14} className="text-text-muted" />
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Min_Order: ₨ {c.minOrderValue || 0}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* VOUCHER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
           <div className="bg-surface w-full max-w-xl rounded-[3rem] shadow-glow border-2 border-brand/20 overflow-hidden">
              <div className="p-10 border-b-2 border-border-frosted flex justify-between items-center bg-surface/50">
                 <div>
                    <h3 className="text-2xl font-black text-text-main uppercase italic">Voucher_Provision.sys</h3>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1">Sequence Deployment Protocol</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-panel rounded-2xl text-text-muted hover:text-brand transition-all border-2 border-border-frosted">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Voucher_ID_Code</label>
                    <input 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-sm uppercase tracking-widest"
                      placeholder="e.g. SUMMER50"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Protocol_Type</label>
                       <select 
                         value={formData.discountType}
                         onChange={(e) => setFormData({...formData, discountType: e.target.value as 'PERCENT' | 'FIXED'})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase"
                       >
                          <option value="PERCENT">Percentage (%)</option>
                          <option value="FIXED">Flat PKR (₨)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Magnitude</label>
                       <input 
                         type="number"
                         value={formData.discountValue || ''}
                         onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs"
                         placeholder="0"
                         required
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Min_Requirement</label>
                       <input 
                         type="number"
                         value={formData.minOrderValue || ''}
                         onChange={(e) => setFormData({...formData, minOrderValue: Number(e.target.value)})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs"
                         placeholder="₨ 0"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Expiry_Marker</label>
                       <input 
                         type="date"
                         value={formData.expiryDate}
                         onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                         className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-[10px] uppercase"
                       />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-brand text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20">
                    Authorize_Deployment
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;

