import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Palette, Store, BellRing, ShieldCheck, Check } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    themeColor: '#2563eb',
    isTaxEnabled: true,
    footerMessage: ''
  });
  const [saved, setSaved] = useState(false);

  // In a real app, you'd fetch these from /api/settings
  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // axios.post('/api/settings', settings);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <section>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Branding</h2>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Store Name</label>
            <input 
              type="text" 
              value={settings.storeName}
              onChange={(e) => setSettings({...settings, storeName: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
              placeholder="e.g. frosted Premium Ice Cream"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Theme Color</label>
            <div className="flex gap-3">
              {['#2563eb', '#db2777', '#059669', '#7c3aed', '#ea580c'].map((color) => (
                <button 
                  key={color}
                  onClick={() => setSettings({...settings, themeColor: color})}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${settings.themeColor === color ? 'border-slate-200 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Operations</h2>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Tax Calculation</p>
                <p className="text-[10px] text-slate-400">Automatically apply GST to sales</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings({...settings, isTaxEnabled: !settings.isTaxEnabled})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.isTaxEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isTaxEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <button 
        onClick={handleSave}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        {saved ? <Check size={18} className="text-green-400" /> : <Save size={18} />}
        {saved ? 'Settings Saved' : 'Save Configuration'}
      </button>
    </div>
  );
};

export default Settings;
