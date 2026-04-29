import React, { useState, useEffect } from 'react';
import { 
  Palette, Bell, Globe, Check, 
  Save, Layout, Printer, Monitor, 
  ShieldCheck, Zap, Cog,
  Eye, HardDrive, CheckCircle2, X, Timer, PieChart, Database, Star, FileText, Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Branding');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'frosted Creamery & Bakery',
    logoUrl: '',
    themeColor: '#db2777',
    currency: 'PKR',
    receiptFont: 'monospace',
    receiptFontSize: '11px',
    receiptHeader: 'THANK YOU FOR VISITING',
    receiptFooter: 'PLEASE COME AGAIN',
    autoPrint: false,
    isKioskMode: true,
    isTaxEnabled: true,
    taxPercentage: 17.0
  });

  const themes = [
    { id: 'light', name: 'Artisan Cream', desc: 'Warm bakery aesthetic', colors: ['#FDFCFB', '#F5F5F4', '#db2777'] },
    { id: 'dark', name: 'Midnight Cocoa', desc: 'High-contrast dark', colors: ['#0a0a0b', '#18181b', '#db2777'] },
    { id: 'emerald-enterprise', name: 'Emerald Mint', desc: 'Fresh & Growth', colors: ['#022c22', '#064e3b', '#10b981'] },
    { id: 'midnight-gold', name: 'Golden Roast', desc: 'Premium luxury', colors: ['#0f172a', '#1e293b', '#fbbf24'] },
    { id: 'ocean-pro', name: 'Blueberry SaaS', desc: 'Deep calm productivity', colors: ['#082f49', '#0c4a6e', '#0ea5e9'] },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data) setSettings(res.data);
      } catch (err) {
        toast.error("Telemetry Sync Failed");
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.post('/settings', settings);
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
    } catch (err) {
        toast.error("Profile Synchronization Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-8 theme-transition overflow-hidden">
      
      {/* HUD: ENGINE CORE */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Cog size={28} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              System <span className="text-brand">Settings</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Manage your store settings</p>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-100 transition-all border-2 border-brand/20 disabled:opacity-50 disabled:grayscale"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Synchronizing...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* SIDE ARCHITECTURE */}
        <div className="col-span-3 industrial-card p-4 flex flex-col space-y-2 border-2 border-white/5">
          <SettingLink icon={<Palette size={18} />} label="Appearance" active={activeTab === 'Branding'} onClick={() => setActiveTab('Branding')} />
          <SettingLink icon={<Monitor size={18} />} label="Terminal" active={activeTab === 'Hardware'} onClick={() => setActiveTab('Hardware')} />
          <SettingLink icon={<FileText size={18} />} label="Receipt" active={activeTab === 'Receipt'} onClick={() => setActiveTab('Receipt')} />
          <SettingLink icon={<ShieldCheck size={18} />} label="Access & RBAC" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
          <SettingLink icon={<Zap size={18} />} label="Automations" active={activeTab === 'Automations'} onClick={() => setActiveTab('Automations')} />
          
          <div className="mt-auto p-4 bg-panel/50 rounded-[1.5rem] border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <HardDrive size={18} className="text-brand opacity-40" />
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Storage: 94%</span>
             </div>
             <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-brand w-[94%] shadow-glow" />
             </div>
          </div>
        </div>

        {/* DATA STREAM */}
        <div className="col-span-9 space-y-8 overflow-y-auto no-scrollbar pb-10">
          
          {activeTab === 'Branding' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <section className="industrial-card p-6 border-2 border-white/5 rounded-[2.5rem] scale-[0.98]">
                  <div className="flex items-center gap-4 mb-8">
                     <Layout className="text-brand" size={24} />
                     <div>
                        <h3 className="text-xl font-black text-text-main uppercase tracking-tighter italic">Experience Skins</h3>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Select global UI aesthetic</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    {themes.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                           setTheme(opt.id as any);
                           setSettings({...settings, themeColor: opt.colors[2]});
                        }}
                        className={`relative p-5 rounded-[2rem] border-2 transition-all duration-500 group flex flex-col items-start ${
                          theme === opt.id ? 'border-brand bg-brand/5 shadow-[0_20px_50px_rgba(219,39,119,0.1)]' : 'border-border-frosted bg-panel/30 hover:border-brand/40'
                        }`}
                      >
                         <div className="w-full h-20 rounded-xl mb-4 p-2 bg-surface border-2 border-white/5 flex items-center justify-center gap-2 relative overflow-hidden group-hover:scale-[1.02] transition-all">
                            <div className="w-6 h-6 rounded-md shadow-lg" style={{ background: opt.colors[0] }} />
                            <div className="w-6 h-6 rounded-md shadow-lg" style={{ background: opt.colors[1] }} />
                            <div className="w-6 h-6 rounded-md shadow-lg animate-pulse" style={{ background: opt.colors[2] }} />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{opt.name}</span>
                         <p className="text-[8px] font-bold text-text-muted mt-1 uppercase opacity-60 tracking-tighter">{opt.desc}</p>
                         {theme === opt.id && <CheckCircle2 className="absolute top-4 right-4 text-brand" size={16} />}
                      </button>
                    ))}
                  </div>
               </section>

                <section className="industrial-card p-6 border-2 border-white/5 rounded-[2.5rem] scale-[0.98]">
                    <div className="flex items-center gap-4 mb-8">
                       <ShieldCheck className="text-brand" size={24} />
                       <div>
                          <h3 className="text-xl font-black text-text-main uppercase tracking-tighter italic">Store Identity</h3>
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Global Branding Nodes</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Store Name (Full)</label>
                          <input 
                            value={settings.storeName}
                            onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                            className="w-full bg-panel border-2 border-border-frosted rounded-xl py-4 px-6 outline-none font-black text-text-main focus:border-brand transition-all uppercase text-[10px]" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Logo Resource (URL)</label>
                          <input 
                            value={settings.logoUrl || ''}
                            onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                            className="w-full bg-panel border-2 border-border-frosted rounded-xl py-4 px-6 outline-none font-black text-text-main focus:border-brand transition-all text-[10px]" 
                            placeholder="https://frosted.io/assets/logo.png"
                          />
                       </div>
                    </div>
                </section>
            </div>
          )}

          {activeTab === 'Hardware' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <section className="industrial-card p-6 border-2 border-white/5 rounded-[2.5rem]">
                   <div className="flex items-center gap-5 mb-10">
                      <Printer className="text-brand" size={28} />
                      <div>
                         <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter italic">Device Settings</h3>
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Hardware Interface Nodes</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <ToggleSetting 
                        icon={<Eye size={20} />} 
                        label="Full Screen Mode" 
                        desc="Maximize information density for 1920p displays" 
                        active={settings.isKioskMode} 
                        onClick={() => setSettings({...settings, isKioskMode: !settings.isKioskMode})} 
                      />
                      <ToggleSetting 
                        icon={<Zap size={20} />} 
                        label="Auto-Print Receipts" 
                        desc="Automatically generate digital invoices on close" 
                        active={settings.autoPrint} 
                        onClick={() => setSettings({...settings, autoPrint: !settings.autoPrint})} 
                      />
                   </div>
                </section>
             </div>
          )}

          {activeTab === 'Receipt' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <section className="industrial-card p-6 border-2 border-white/5 rounded-[2.5rem] scale-[0.98]">
                   <div className="flex items-center gap-4 mb-8">
                      <FileText className="text-brand" size={24} />
                      <div>
                         <h3 className="text-xl font-black text-text-main uppercase tracking-tighter italic">Receipt Engine</h3>
                         <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Thermal Output Configuration</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-12 lg:col-span-7 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Font Family</label>
                              <select 
                                value={settings.receiptFont}
                                onChange={(e) => setSettings({...settings, receiptFont: e.target.value})}
                                className="w-full bg-panel border-2 border-border-frosted rounded-xl py-3 px-4 outline-none font-black text-[10px] uppercase tracking-widest"
                              >
                                 <option value="monospace">Standard Mono</option>
                                 <option value="serif">Classic Serif</option>
                                 <option value="sans-serif">Modern Sans</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Font Size (px)</label>
                              <input 
                                value={settings.receiptFontSize}
                                onChange={(e) => setSettings({...settings, receiptFontSize: e.target.value})}
                                className="w-full bg-panel border-2 border-border-frosted rounded-xl py-3 px-4 outline-none font-black text-[10px] uppercase"
                                placeholder="11px"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Header Message</label>
                           <textarea 
                             rows={2}
                             value={settings.receiptHeader || ''}
                             onChange={(e) => setSettings({...settings, receiptHeader: e.target.value})}
                             className="w-full bg-panel border-2 border-border-frosted rounded-xl py-3 px-6 outline-none font-black text-[10px] uppercase"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Footer Message</label>
                           <textarea 
                             rows={2}
                             value={settings.receiptFooter || ''}
                             onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
                             className="w-full bg-panel border-2 border-border-frosted rounded-xl py-3 px-6 outline-none font-black text-[10px] uppercase"
                           />
                        </div>
                      </div>

                      {/* LIVE RECEIPT PREVIEW (MINI) */}
                      <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-xl text-black shadow-lg border border-border-frosted max-h-[400px] overflow-hidden flex flex-col items-center">
                         <div className="text-center w-full" style={{ fontFamily: settings.receiptFont, fontSize: settings.receiptFontSize }}>
                            <p className="font-black text-lg">frosted</p>
                            <p className="text-[8px] mb-4">CREAMERY & BAKERY</p>
                            <p className="border-y border-black py-1 my-2 whitespace-pre-wrap">{settings.receiptHeader}</p>
                            <div className="flex justify-between my-2 text-[9px]">
                               <span>ITEM X1</span>
                               <span>₨ 500</span>
                            </div>
                            <p className="border-t-2 border-black pt-2 font-black">TOTAL: ₨ 500</p>
                            <p className="mt-4 whitespace-pre-wrap">{settings.receiptFooter}</p>
                            <div className="w-12 h-12 bg-black/10 mt-4 mx-auto" />
                         </div>
                      </div>
                   </div>
                </section>
             </div>
          )}

          {activeTab === 'Security' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <section className="industrial-card p-6 border-2 border-white/5 rounded-[2.5rem]">
                   <div className="flex items-center gap-5 mb-10">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter italic">Role Identity</h3>
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Current authorization profile</p>
                      </div>
                   </div>
                   
                   <div className="bg-panel border-2 border-border-frosted rounded-[2rem] p-8">
                      <div className="flex items-center justify-between border-b-2 border-white/5 pb-6 mb-6">
                         <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-1">Authenticated As</p>
                            <p className="text-xl font-black text-text-main uppercase italic">{JSON.parse(localStorage.getItem('user') || '{"username":"ADMIN"}').username}</p>
                         </div>
                         <div className="px-5 py-2 bg-brand text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-glow">
                            {JSON.parse(localStorage.getItem('user') || '{"role":"ADMIN"}').role}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                         <PermissionNode label="Core Terminal Access" granted={true} />
                         <PermissionNode label="Inventory Modification" granted={['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN'].includes(JSON.parse(localStorage.getItem('user') || '{}').role)} />
                         <PermissionNode label="Void/Refund Rights" granted={['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(JSON.parse(localStorage.getItem('user') || '{}').role)} />
                         <PermissionNode label="Financial Reporting" granted={['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(JSON.parse(localStorage.getItem('user') || '{}').role)} />
                         <PermissionNode label="Staff Onboarding" granted={['SUPERADMIN', 'ADMIN', 'MANAGER'].includes(JSON.parse(localStorage.getItem('user') || '{}').role)} />
                         <PermissionNode label="Discount Override" granted={['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'].includes(JSON.parse(localStorage.getItem('user') || '{}').role)} />
                      </div>
                   </div>
                </section>
             </div>
          )}

          {activeTab === 'Automations' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <section className="industrial-card p-10 border-2 border-white/5 rounded-[3rem]">
                   <div className="flex items-center gap-5 mb-10">
                      <Zap className="text-brand" size={28} />
                      <div>
                         <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter italic">Store Protocols</h3>
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Global logic overrides</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <ToggleSetting 
                        icon={<Timer size={20} />} 
                        label="Auto-Logout" 
                        desc="Terminate session after 15mins of inactivity" 
                        active={true} 
                        onClick={() => {}} 
                      />
                      <ToggleSetting 
                        icon={<PieChart size={20} />} 
                        label="Cloud Sync" 
                        desc="Sync transactions with mothership in real-time" 
                        active={true} 
                        onClick={() => {}} 
                      />
                      <ToggleSetting 
                        icon={<Star size={20} />} 
                        label="Loyalty Engine" 
                        desc="Enable +5 points for every 100 PKR spent" 
                        active={true} 
                        onClick={() => {}} 
                      />
                      <ToggleSetting 
                        icon={<Database size={20} />} 
                        label="Ledger Lock" 
                        desc="Prevent modification of historical sales" 
                        active={true} 
                        onClick={() => {}} 
                      />
                   </div>
                </section>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingLink = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 group ${
      active 
      ? 'bg-text-main text-surface shadow-glow translate-x-1' 
      : 'text-text-muted hover:bg-surface hover:text-text-main border-2 border-transparent hover:border-brand/20'
    }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110 text-brand' : 'group-hover:translate-x-1'}`}>
      {icon}
    </span>
    {label}
  </button>
);

const ToggleSetting = ({ icon, label, desc, active, onClick }: any) => (
  <button onClick={onClick} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-3 text-left scale-[0.98] ${active ? 'bg-brand/5 border-brand' : 'bg-panel/30 border-white/5 hover:border-brand/30'}`}>
     <div className={`p-2.5 rounded-xl ${active ? 'bg-brand text-white' : 'bg-surface text-text-muted'} transition-all`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
     </div>
     <div>
        <p className="text-[10px] font-black text-text-main uppercase tracking-widest">{label}</p>
        <p className="text-[8px] font-bold text-text-muted mt-1 uppercase opacity-60 leading-tight">{desc}</p>
     </div>
  </button>
);

const PermissionNode = ({ label, granted }: any) => (
  <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${granted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/10 opacity-40'}`}>
     <span className={`text-[10px] font-black uppercase tracking-widest ${granted ? 'text-emerald-500' : 'text-text-muted'}`}>{label}</span>
     {granted ? <CheckCircle2 size={16} className="text-emerald-500" /> : <X size={16} className="text-red-500" />}
  </div>
);

export default Settings;
