import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, User, LayoutGrid, Loader2, ShieldCheck, Fingerprint, Activity } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(`Access Authorized: ${response.data.user.name}`);
        
        // Dynamic routing based on role if needed
        const role = response.data.user.role;
        setTimeout(() => {
          if (role === 'KITCHEN') window.location.href = '/kitchen';
          else window.location.href = '/dashboard';
        }, 500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication Engine Offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center theme-transition bg-[#0a0a0b] overflow-hidden relative font-lexend">
      
      {/* KIOSK AMBIENCE: High-Fidelity Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(219,39,119,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      <div className="w-full max-w-xl z-10 px-8 flex flex-col items-center">
        
        <div className="relative mb-16 text-center">
           <div className="w-24 h-24 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow mx-auto mb-8 animate-in zoom-in duration-1000">
              <LayoutGrid size={48} />
           </div>
           <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                OFTSY <span className="text-brand">CORE</span>
              </h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] mt-2">Hybrid_Enterprise_Terminal</p>
           </div>
        </div>

        <form onSubmit={handleLogin} className="w-full bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border-2 border-white/5 shadow-2xl space-y-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />
           
           <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Operator_Identity</label>
                 <Activity size={14} className="text-brand opacity-20" />
              </div>
              <div className="relative group/input">
                 <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-brand transition-all" size={20} />
                 <input 
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full bg-white/5 border-2 border-white/5 rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand/40 text-white font-black text-sm uppercase tracking-widest placeholder:text-white/10 transition-all font-mono"
                   placeholder="Sequence_ID"
                   required
                 />
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Security_Cipher</label>
                 <ShieldCheck size={14} className="text-brand opacity-20" />
              </div>
              <div className="relative group/input">
                 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-brand transition-all" size={20} />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-white/5 border-2 border-white/5 rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-brand/40 text-white font-black text-sm uppercase tracking-widest placeholder:text-white/10 transition-all font-mono"
                   placeholder="••••••••"
                   required
                 />
              </div>
           </div>

           <button 
             disabled={loading}
             className="w-full bg-brand hover:brightness-110 active:scale-[0.98] text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all disabled:opacity-50 shadow-glow flex items-center justify-center gap-4 border-2 border-brand/20 group/btn overflow-hidden relative"
           >
             <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
             {loading ? (
                <Loader2 className="animate-spin" size={24} />
             ) : (
                <>
                  <Fingerprint size={24} className="opacity-60" />
                  Initialize_Core.bin
                </>
             )}
           </button>

           <div className="flex justify-center gap-4 pt-4">
              <div className="h-1 w-8 rounded-full bg-brand/20" />
              <div className="h-1 w-24 rounded-full bg-brand/10" />
              <div className="h-1 w-8 rounded-full bg-brand/20" />
           </div>
        </form>

        <div className="mt-16 flex items-center gap-4 text-center">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Secure Node Link Established • Region: PK-SOUTH</p>
        </div>
      </div>
    </div>
  );
};

export default Login;