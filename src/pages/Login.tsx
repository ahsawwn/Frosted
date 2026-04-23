import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, User, IceCream } from 'lucide-react';

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
        // 1. Save data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // 2. Alert the user
        toast.success(`Welcome, ${response.data.user.name}`);
        
        // 3. FORCE REDIRECT (This avoids all React Router state bugs)
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-4">
            <IceCream size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Oftsy <span className="text-blue-600">POS</span></h1>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold mt-1" 
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold mt-1" 
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;