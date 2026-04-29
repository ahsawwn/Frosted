import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  User, 
  Shield, 
  Mail, 
  Calendar, 
  Edit2, 
  X, 
  Lock, 
  Loader2, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const Profile = () => {
  // --- States ---
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });

  // --- Form States ---
  const [formData, setFormData] = useState({ name: '', username: '', email: '' });
  const [passData, setPassData] = useState({ current: '', new: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      setFormData({ 
        name: data.name || '', 
        username: data.username || '', 
        email: data.email || '' 
      });
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Failed to sync profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const token = localStorage.getItem('accessToken');
      const payload: any = { ...formData };

      // Only send password fields if both are filled
      if (passData.current && passData.new) {
        payload.currentPassword = passData.current;
        payload.newPassword = passData.new;
      }

      const { data } = await axios.put('/api/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({ ...user, ...data.user });
      setIsEditing(false);
      setPassData({ current: '', new: '' });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Update failed. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium tracking-wide">Initializing Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your identity and system credentials at frosted.</p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setIsEditing(false); setStatus({ type: '', message: '' }); }}
                className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 disabled:opacity-50 transition-all active:scale-95"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Notifications */}
      {status.message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-in zoom-in duration-300 ${
          status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Identity Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <div className="w-28 h-28 bg-slate-50 border-4 border-white shadow-xl rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-blue-600">
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{user.name}</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">@{user.username}</p>
            
            <div className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-full">
              <Shield size={12} /> {user.role}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 grid grid-cols-1 gap-4 text-left">
               <div className="flex items-center gap-3 text-slate-500">
                  <Calendar size={16} />
                  <span className="text-xs font-semibold">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Configuration */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Section */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Display Name</label>
                <input 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none disabled:opacity-60 font-medium"
                  placeholder="e.g. Ahsan Shahid"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Username</label>
                <input 
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none disabled:opacity-60 font-medium"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    disabled={!isEditing}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none disabled:opacity-60 font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Security Section (Conditional) */}
          <section className={`bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all ${!isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Credentials</h4>
               {!isEditing && <Lock size={16} className="text-slate-300" />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Current Password</label>
                <input 
                  type="password"
                  disabled={!isEditing}
                  value={passData.current}
                  onChange={(e) => setPassData({...passData, current: e.target.value})}
                  placeholder="Required for changes"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">New Password</label>
                <input 
                  type="password"
                  disabled={!isEditing}
                  value={passData.new}
                  onChange={(e) => setPassData({...passData, new: e.target.value})}
                  placeholder="Minimum 8 characters"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none font-medium"
                />
              </div>
            </div>
            {isEditing && (
              <p className="text-[10px] text-slate-400 font-bold mt-6 tracking-wide">
                * TO KEEP YOUR ACCOUNT SECURE, BOTH FIELDS ARE REQUIRED TO UPDATE YOUR PASSWORD.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
