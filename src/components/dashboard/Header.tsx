import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, LogOut, User, 
  Settings, ChevronDown, Circle, 
  LayoutGrid, Command
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlobalSearch from './GlobalSearch'; 

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [notifications] = useState([
    { id: 1, title: 'Low Stock Alert', msg: 'Chocolate chips below 5kg', time: '2m ago', unread: true },
    { id: 2, title: 'New Order', msg: 'Order #8829 successful', time: '15m ago', unread: true },
    { id: 3, title: 'System Update', msg: 'Oftsy Engine v4.5 live', time: '1h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    toast.loading("Ending session...");
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <header className="h-20 bg-surface/80 backdrop-blur-3xl border-b-2 border-border-oftsy px-10 flex items-center justify-between theme-transition">
        
        {/* BRAND PROPULSION */}
        <div className="flex items-center gap-12 flex-1">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-12 h-12 bg-text-main rounded-2xl flex items-center justify-center text-brand shadow-glow group-hover:rotate-12 transition-all duration-700">
                <LayoutGrid size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
                  Oftsy <span className="text-brand">Creamery</span>
                </h1>
                <p className="text-[9px] font-black text-text-muted tracking-[0.4em] uppercase mt-1">Artisan Systems</p>
            </div>
          </div>

          {/* GLOBAL SEARCH INJECTOR */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="relative w-full max-w-lg hidden xl:flex items-center cursor-pointer group"
          >
            <Search className="absolute left-5 text-text-muted group-hover:text-brand transition-colors" size={18} />
            <div className="w-full bg-panel border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 font-black text-[10px] text-text-muted group-hover:bg-panel/50 group-hover:border-brand transition-all outline-none uppercase tracking-widest">
              Terminal Search...
            </div>
            <div className="absolute right-5 flex gap-1 items-center">
              <span className="flex items-center gap-2 bg-surface px-2.5 py-1 rounded-lg border-2 border-border-oftsy text-[9px] font-black text-text-muted uppercase tracking-widest shadow-sm">
                <Command size={10} /> K
              </span>
            </div>
          </div>
        </div>

        {/* OPERATION TERMINALS */}
        <div className="flex items-center gap-8">
          
          {/* SECURE NOTIFICATIONS */}
          <div className="relative">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative border-2 ${isNotifOpen ? 'bg-brand/10 text-brand border-brand shadow-glow' : 'bg-panel text-text-muted border-border-oftsy hover:bg-surface hover:text-brand'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-4 h-4 bg-brand border-2 border-surface rounded-full text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-4 w-80 glass-panel rounded-3xl p-6 animate-in slide-in-from-top-4 duration-500 overflow-hidden z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-brand">System Feed</h3>
                  <span className="text-[8px] font-black text-text-muted uppercase cursor-pointer hover:text-brand transition-colors">Clear All</span>
                </div>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group relative border border-transparent hover:border-white/10">
                      {n.unread && <Circle size={6} className="absolute top-4 right-4 fill-brand text-brand shadow-glow" />}
                      <p className="text-[11px] font-black text-text-main uppercase italic tracking-tighter">{n.title}</p>
                      <p className="text-[9px] text-text-muted font-bold leading-relaxed mt-1">{n.msg}</p>
                      <p className="text-[8px] text-text-muted/50 font-black mt-2 uppercase tracking-widest">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-[1.5px] h-8 bg-border-oftsy hidden sm:block" />

          {/* IDENTITY MODULE */}
          <div className="relative">
            <button 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className="flex items-center gap-4 p-1.5 pr-5 bg-panel rounded-[1.5rem] hover:bg-surface transition-all border-2 border-border-oftsy hover:border-brand group"
            >
              <div className="w-10 h-10 bg-text-main rounded-xl flex items-center justify-center text-white font-black text-[11px] italic group-hover:scale-105 transition-all">
                AS
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[11px] font-black text-text-main uppercase tracking-tighter italic leading-none">Ahsawn Shahid</p>
                <p className="text-[9px] font-black text-brand uppercase tracking-widest mt-1 opacity-70">Controller</p>
              </div>
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-6 w-72 glass-panel rounded-[3rem] overflow-hidden animate-in slide-in-from-top-4 duration-500 z-50">
                <div className="p-3">
                  <a href="/profile" className="flex items-center gap-4 p-5 hover:bg-white/5 rounded-[2rem] transition-all group">
                    <div className="w-10 h-10 bg-panel rounded-xl flex items-center justify-center text-text-muted group-hover:text-brand transition-all">
                      <User size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Bio Identity</span>
                  </a>
                  <a href="/settings" className="flex items-center gap-4 p-5 hover:bg-white/5 rounded-[2rem] transition-all group">
                    <div className="w-10 h-10 bg-panel rounded-xl flex items-center justify-center text-text-muted group-hover:text-brand transition-all">
                      <Settings size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Core Engine</span>
                  </a>
                  <div className="h-[2px] bg-border-oftsy mx-5 my-3" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-5 hover:bg-brand/10 rounded-[2.5rem] transition-all group text-left"
                  >
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:scale-110 transition-all">
                      <LogOut size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-brand">Secure Eject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;