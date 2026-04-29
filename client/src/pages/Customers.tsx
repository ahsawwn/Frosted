import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, UserPlus, Search, Mail, 
  Phone, MapPin, Trash2, Edit3, X, 
  Loader2, Trophy 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      toast.error("Telemetry Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.patch(`/customers/${editingCustomer.id}`, formData);
        toast.success("Identity Node Patched");
      } else {
        await api.post('/customers', formData);
        toast.success("New Identity Registered");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Protocol Deviation");
    }
  };

  const deleteCustomer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("PURGE_IDENTITY_DATA?")) return;
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
      toast.success("Identity Purged");
    } catch (err) {
      toast.error("Security Restriction");
    }
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      loyaltyPoints: customer.loyaltyPoints
    });
    setIsModalOpen(true);
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: IDENTITY REPOSITORY */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              frosted <span className="text-brand">Clients</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5">User Identity Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={18} />
            <input 
              type="text"
              placeholder="Query identity..."
              className="bg-panel border-2 border-border-frosted rounded-2xl py-4 pl-14 pr-6 w-64 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setEditingCustomer(null); setFormData({ name: '', email: '', phone: '', address: '', loyaltyPoints: 0 }); setIsModalOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow transition-all border-2 border-brand/20"
          >
            <UserPlus size={18} /> Register_Client
          </button>
        </div>
      </div>

      {/* IDENTITY TABLE */}
      <div className="industrial-card rounded-[2.5rem] border-2 border-white/5 flex-1 overflow-hidden flex flex-col bg-surface/30 backdrop-blur-3xl">
        <div className="overflow-y-auto flex-1 no-scrollbar p-6">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 z-10">
              <tr className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                <th className="px-8 py-3">Client_Node</th>
                <th className="px-8 py-3">Contact_Protocol</th>
                <th className="px-8 py-3">Loyalty_Rank</th>
                <th className="px-8 py-3 text-right">Security_Pulse</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-brand" size={48} /></td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="group hover:bg-surface transition-all">
                  <td className="px-8 py-5 bg-panel/30 first:rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-border-frosted border-l-transparent group-hover:bg-surface">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-text-main rounded-xl flex items-center justify-center text-brand font-black italic shadow-glow text-[11px]">
                          {c.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <p className="font-black text-text-main text-base uppercase tracking-tighter italic">{c.name}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase mt-0.5 tracking-widest flex items-center gap-1.5">
                             <MapPin size={10} className="text-brand opacity-40" /> {c.address || 'LOC_PENDING'}
                          </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 bg-panel/30 border-y-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                          <Phone size={12} className="text-brand" /> {c.phone}
                       </p>
                       <p className="text-[9px] font-black text-text-muted lowercase tracking-tight flex items-center gap-2">
                          <Mail size={10} className="text-brand opacity-40" /> {c.email}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-5 bg-panel/30 border-y-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface">
                    <div className="flex items-center gap-2.5">
                       <Trophy className="text-amber-500 shadow-glow" size={16} />
                       <span className="text-[10px] font-black text-text-main uppercase tracking-[0.15em]">{c.loyaltyPoints} PTS</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 bg-panel/30 last:rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface text-right border-r-transparent">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(c)} className="p-3 bg-surface text-text-muted hover:text-brand hover:border-brand border-2 border-border-frosted rounded-xl transition-all shadow-sm">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={(e) => deleteCustomer(c.id, e)} className="p-3 bg-surface text-text-muted hover:text-red-500 hover:border-red-500 border-2 border-border-frosted rounded-xl transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IDENTITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-surface w-full max-w-2xl rounded-[3rem] shadow-glow border-2 border-brand/20 overflow-hidden">
             <div className="p-10 border-b-2 border-border-frosted flex justify-between items-center bg-surface/50">
                <div>
                   <h3 className="text-2xl font-black text-text-main uppercase italic">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
                   <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1">Enter customer details</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-panel rounded-2xl text-text-muted hover:text-brand transition-all border-2 border-border-frosted">
                   <X size={20} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Full Name</label>
                      <input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase"
                        required
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Phone Number</label>
                      <input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase"
                        required
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Email Address</label>
                   <input 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs lowercase"
                     required
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Address</label>
                   <input 
                     value={formData.address}
                     onChange={(e) => setFormData({...formData, address: e.target.value})}
                     className="w-full bg-panel border-2 border-border-frosted rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase"
                   />
                </div>
                <button type="submit" className="w-full py-6 bg-brand text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20">
                   Save Customer Info
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

