import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, LogOut, User, 
  Settings, ChevronDown, Circle, 
  Command, Sparkles, LayoutGrid
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low Stock Alert', msg: 'Chocolate chips below 5kg', time: '2m ago', unread: true },
    { id: 2, title: 'New Order', msg: 'Order #8829 successful', time: '15m ago', unread: true },
    { id: 3, title: 'System Update', msg: 'Oftsy v2.4 is now live', time: '1h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    toast.loading("Ending session...");
    setTimeout(() => {
      // Clear your auth tokens here
      window.location.href = '/login';
    }, 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Searching for: ${searchQuery}`, { icon: '🔍' });
    // Add logic to redirect to search results or filter global state
  };

  return (
    <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-40 sticky top-0">
      
      {/* 1. BRAND & SEARCH SECTION */}
      <div className="flex items-center gap-12 flex-1">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-pink-500 shadow-xl shadow-pink-100 group-hover:rotate-6 transition-transform">
             <LayoutGrid size={24} />
          </div>
          <div>
             <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
               Oftsy <span className="text-pink-500 text-lg">Systems</span>
             </h1>
             <p className="text-[8px] font-black text-slate-400 tracking-[0.3em] uppercase mt-1">Enterprise Console</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden xl:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search terminal (Cmd + K)"
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-xs focus:ring-4 focus:ring-pink-500/5 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="bg-white px-2 py-1 rounded-md border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Cmd</kbd>
            <kbd className="bg-white px-2 py-1 rounded-md border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">K</kbd>
          </div>
        </form>
      </div>

      {/* 2. ACTIONS SECTION */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${isNotifOpen ? 'bg-pink-50 text-pink-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-4 h-4 bg-pink-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notif Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 animate-in slide-in-from-top-4 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 pr-2">Notifications</h3>
                <span className="text-[8px] font-black text-pink-500 uppercase cursor-pointer">Clear All</span>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group relative">
                    {n.unread && <Circle size={6} className="absolute top-4 right-4 fill-pink-500 text-pink-500" />}
                    <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter">{n.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight">{n.msg}</p>
                    <p className="text-[8px] text-slate-300 font-black mt-1 uppercase">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />

        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-4 p-1.5 pr-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs italic shadow-lg">
              AS
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter italic leading-none">Ahsan Shahid</p>
              <p className="text-[8px] font-bold text-pink-500 uppercase tracking-widest mt-1">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
              <div className="p-2">
                <a href="/profile" className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                    <User size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">My Profile</span>
                </a>
                <a href="/settings" className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
                    <Settings size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Settings</span>
                </a>
                <div className="h-[1px] bg-slate-50 mx-4 my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-2xl transition-colors group"
                >
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-400 group-hover:text-red-600 transition-colors">
                    <LogOut size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;