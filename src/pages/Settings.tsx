import React, { useState } from 'react';
import { 
  Palette, Bell, Globe, Lock, Check, 
  Save, Monitor, Smartphone, ShieldCheck,
  CreditCard, Zap, Layout
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Branding');

  const handleUpdate = () => {
    toast.success("System Profile Synchronized", {
      style: { 
        borderRadius: '1.5rem', 
        background: 'var(--text-main)', 
        color: 'var(--surface)',
        fontWeight: '900',
        fontSize: '12px',
        textTransform: 'uppercase'
      }
    });
  };

  const themes = [
    { id: 'light', name: 'Classic Oftsy', desc: 'Standard pink branding', accent: 'bg-[#db2777]' },
    { id: 'dark', name: 'Terminal Night', desc: 'High-contrast deep mode', accent: 'bg-[#f472b6]' },
    { id: 'emerald-enterprise', name: 'Emerald Growth', desc: 'Professional & Stable', accent: 'bg-[#10b981]' },
    { id: 'midnight-gold', name: 'Luxury POS', desc: 'Premium retail aesthetic', accent: 'bg-[#fbbf24]' },
    { id: 'ocean-pro', name: 'Oceanic SaaS', desc: 'Calm & Trustworthy', accent: 'bg-[#0ea5e9]' },
  ];

  return (
    <div className="max-w-[1700px] mx-auto p-6 lg:p-12 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-6xl font-black text-text-main tracking-tighter italic uppercase leading-none">
            Settings
          </h1>
          <p className="text-text-muted font-black text-[10px] tracking-[0.4em] uppercase mt-4 ml-1">
            Global Enterprise Configuration <span className="text-brand opacity-50">//</span> OFTSY v4.0
          </p>
        </div>
        <button 
          onClick={handleUpdate}
          className="bg-brand text-white px-10 py-5 rounded-oftsy font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 flex items-center gap-3"
        >
          <Save size={18} /> Push Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-3">
          <SettingLink icon={<Palette size={20} />} label="Branding & UI" active={activeTab === 'Branding'} onClick={() => setActiveTab('Branding')} />
          <SettingLink icon={<Bell size={20} />} label="Alerts & Logic" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
          <SettingLink icon={<Globe size={20} />} label="Region & Tax" active={activeTab === 'Localization'} onClick={() => setActiveTab('Localization')} />
          <SettingLink icon={<Lock size={20} />} label="Access Control" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
          
          <div className="pt-8">
            <div className="bg-brand/5 p-6 rounded-[2rem] border border-brand/10">
              <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                <span className="text-xs font-bold text-text-main">All Modules Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* Theme Selector Section */}
          <section className="bg-surface rounded-oftsy p-10 border border-border-oftsy shadow-oftsy">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-panel rounded-2xl flex items-center justify-center text-brand">
                <Layout size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl text-text-main uppercase italic tracking-tight">Visual Identities</h3>
                <p className="text-xs text-text-muted font-bold">Select a global profile to update all terminal interfaces</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
              {themes.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id as any)}
                  className={`relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 group flex flex-col items-start text-left ${
                    theme === opt.id 
                    ? 'border-brand bg-brand/5 scale-[1.02]' 
                    : 'border-border-oftsy bg-panel hover:border-text-muted'
                  }`}
                >
                  <div className={`w-full h-24 rounded-2xl mb-4 relative overflow-hidden transition-transform group-hover:rotate-2 ${
                    opt.id === 'dark' ? 'bg-slate-900' : opt.id === 'midnight-gold' ? 'bg-neutral-800' : 'bg-white'
                  } border border-border-oftsy/50`}>
                    <div className={`absolute top-3 left-3 w-6 h-6 rounded-lg ${opt.accent} shadow-lg shadow-black/10`} />
                    <div className="absolute bottom-3 left-3 right-3 h-2 bg-text-muted/10 rounded-full" />
                    <div className="absolute bottom-6 left-3 w-1/2 h-2 bg-text-muted/10 rounded-full" />
                  </div>
                  
                  <span className="font-black text-[11px] uppercase tracking-widest text-text-main">{opt.name}</span>
                  <p className="text-[9px] font-bold text-text-muted mt-1 leading-tight">{opt.desc}</p>
                  
                  {theme === opt.id && (
                    <div className="absolute -top-2 -right-2 bg-brand text-white p-1.5 rounded-full shadow-lg">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Business Details Section */}
          <section className="bg-surface rounded-oftsy p-10 border border-border-oftsy shadow-oftsy">
             <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-panel rounded-2xl flex items-center justify-center text-text-main">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl text-text-main uppercase italic tracking-tight">Enterprise Identity</h3>
                <p className="text-xs text-text-muted font-bold">Public-facing credentials and localizations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Store Trading Name</label>
                <input 
                  type="text" 
                  defaultValue="Oftsy Systems (SMC-PVT) LTD" 
                  className="w-full bg-panel border-none rounded-[1.5rem] py-6 px-8 outline-none font-black text-text-main focus:ring-4 focus:ring-brand/10 transition-all" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Base Operations Currency</label>
                <select className="w-full bg-panel border-none rounded-[1.5rem] py-6 px-8 outline-none font-black text-text-main appearance-none cursor-pointer">
                  <option>PKR (₨) - Pakistan Operations</option>
                  <option>GBP (£) - UK Operations</option>
                  <option>USD ($) - Global Standard</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingLink = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group ${
      active 
      ? 'bg-text-main text-surface shadow-2xl shadow-text-main/20 translate-x-2' 
      : 'text-text-muted hover:bg-surface hover:text-text-main border border-transparent hover:border-border-oftsy'
    }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-125 text-brand' : 'group-hover:translate-x-1'}`}>
      {icon}
    </span>
    {label}
  </button>
);

export default Settings;