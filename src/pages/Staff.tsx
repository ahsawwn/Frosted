import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, Search, 
  Users, ShieldCheck, Trash2, 
  Mail, Fingerprint, Loader2, X, Lock, Key
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'MANAGER' | 'CASHIER' | 'KITCHEN';
}

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'CASHIER' as const
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/auth/staff');
      setStaff(response.data);
    } catch (err) {
      toast.error("Security Link Failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData);
      toast.success("Identity Sequence Provisioned");
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error("Identity Encryption Error");
    }
  };

  const deleteStaff = async (id: string) => {
    if (!window.confirm("TERMINATE_OPERATOR_LINK?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/auth/staff/${id}`);
      setStaff(staff.filter(s => s.id !== id));
      toast.success("Link Severed");
    } catch (err) {
      toast.error("Serveration Protocol Failure");
    }
  };

  const filtered = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: TEAM COMMAND */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              Oftsy <span className="text-brand">Operators</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Personnel Authentication Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={18} />
            <input 
              type="text"
              placeholder="Verify identity..."
              className="bg-panel border-2 border-border-oftsy rounded-2xl py-4 pl-14 pr-6 w-64 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setFormData({ name: '', username: '', email: '', password: '', role: 'CASHIER' }); setIsModalOpen(true); }}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20"
          >
            <UserPlus size={18} /> Onboard.bin
          </button>
        </div>
      </div>

      {/* OPERATOR DATA TABLE */}
      <div className="industrial-card rounded-[2.5rem] border-2 border-white/5 flex-1 overflow-hidden flex flex-col bg-surface/30 backdrop-blur-3xl">
        <div className="overflow-y-auto flex-1 no-scrollbar p-6">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 z-10 bg-surface/50 backdrop-blur-xl">
              <tr className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                <th className="px-8 py-3">Identity_Node</th>
                <th className="px-8 py-3">Role_Protocol</th>
                <th className="px-8 py-3">Access_Status</th>
                <th className="px-8 py-3 text-right">Security_Pulse</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-brand" size={48} /></td></tr>
              ) : filtered.map((member) => (
                <tr key={member.id} className="group hover:bg-surface transition-all">
                  <td className="px-8 py-6 bg-panel/30 first:rounded-l-2xl border-y-2 border-l-2 border-transparent group-hover:border-border-oftsy border-l-transparent group-hover:bg-surface">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-text-main rounded-xl flex items-center justify-center text-brand font-black italic shadow-glow text-[11px]">
                          {member.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <p className="font-black text-text-main text-base uppercase tracking-tighter italic">{member.name}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase mt-1 tracking-widest flex items-center gap-1.5 focus:border-brand">
                             <Mail size={10} className="text-brand opacity-40" /> {member.email}
                          </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 bg-panel/30 border-y-2 border-transparent group-hover:border-border-oftsy group-hover:bg-surface">
                    <div className="flex items-center gap-2.5">
                       <ShieldCheck className={member.role === 'MANAGER' ? 'text-brand' : member.role === 'KITCHEN' ? 'text-amber-500' : 'text-emerald-500'} size={16} />
                       <span className="text-[10px] font-black text-text-main uppercase tracking-[0.15em]">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 bg-panel/30 border-y-2 border-transparent group-hover:border-border-oftsy group-hover:bg-surface">
                    <span className="px-5 py-1.5 bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      Authorized
                    </span>
                  </td>
                  <td className="px-8 py-6 bg-panel/30 last:rounded-r-2xl border-y-2 border-r-2 border-transparent group-hover:border-border-oftsy group-hover:bg-surface text-right border-r-transparent">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-3 bg-surface text-text-muted hover:text-brand hover:border-brand border-2 border-border-oftsy rounded-xl transition-all shadow-sm">
                        <Fingerprint size={18} />
                      </button>
                      <button onClick={() => deleteStaff(member.id)} className="p-3 bg-surface text-text-muted hover:text-red-500 hover:border-red-500 border-2 border-border-oftsy rounded-xl transition-all shadow-sm">
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

      {/* OPERATOR ONBOARDING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
           <div className="bg-surface w-full max-w-2xl rounded-[3rem] shadow-glow border-2 border-brand/20 overflow-hidden">
              <div className="p-10 border-b-2 border-border-oftsy flex justify-between items-center bg-surface/50">
                 <div>
                    <h3 className="text-2xl font-black text-text-main uppercase italic">Add New Staff Member</h3>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Fill in the details to create a new account</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-panel rounded-2xl text-text-muted hover:text-brand transition-all border-2 border-border-oftsy">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-12 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Full Name</label>
                       <input 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-sm uppercase"
                         placeholder="e.g. John Doe"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Username</label>
                       <input 
                         value={formData.username}
                         onChange={(e) => setFormData({...formData, username: e.target.value})}
                         className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs uppercase tracking-widest"
                         placeholder="e.g. johndoe123"
                         required
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Email Address</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 px-6 outline-none focus:border-brand font-black text-xs"
                      placeholder="email@example.com"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Password</label>
                       <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand" size={16} />
                          <input 
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-brand font-black text-xs"
                            placeholder="********"
                            required
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Staff Role</label>
                       <div className="relative group">
                          <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand" size={16} />
                          <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                            className="w-full bg-panel border-2 border-border-oftsy rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-brand font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                          >
                             <option value="SUPERADMIN">Super Admin</option>
                             <option value="ADMIN">Admin</option>
                             <option value="MANAGER">Manager</option>
                             <option value="CASHIER">Cashier</option>
                             <option value="KITCHEN">Kitchen</option>
                          </select>
                       </div>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-brand text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20">
                    Create Staff Account
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Staff;