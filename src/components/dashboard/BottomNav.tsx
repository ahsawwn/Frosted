import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, FileText, Package, 
  BookOpen, Users, Settings, ChevronLeft 
} from 'lucide-react';

const BottomNav = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      
      {/* 1. The Navigation Bar (Uses global theme variables) */}
      <nav 
        className={`
          bg-text-main/95 backdrop-blur-xl p-2.5 rounded-[2.5rem] shadow-oftsy
          border border-white/10 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isHidden 
            ? 'translate-x-[20px] opacity-0 pointer-events-none scale-90' 
            : 'translate-x-0 opacity-100'
          }
          w-[90vw] max-w-2xl
        `}
      >
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Home" />
        <NavItem to="/pos" icon={<ShoppingCart size={20} />} label="POS" />
        <NavItem to="/transactions" icon={<FileText size={20} />} label="Logs" />
        <NavItem to="/inventory" icon={<Package size={20} />} label="Stock" />
        <NavItem to="/recipes" icon={<BookOpen size={20} />} label="Recipe" />
        <NavItem to="/staff" icon={<Users size={20} />} label="Staff" />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Config" />
      </nav>

      {/* 2. The Toggle Button (Brand-aware colors) */}
      <button 
        onClick={() => setIsHidden(!isHidden)}
        className={`
          p-4 rounded-full shadow-2xl transition-all duration-700 flex items-center justify-center border border-white/5
          ${isHidden 
            ? 'bg-brand text-white rotate-0 translate-x-[-150%] sm:translate-x-[-300%]' 
            : 'bg-text-main text-text-muted hover:text-surface rotate-180'
          }
        `}
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group relative flex flex-col items-center justify-center py-2 px-3 rounded-3xl transition-all duration-500
      ${isActive ? 'bg-brand text-white flex-[2]' : 'text-text-muted hover:text-surface flex-1'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className="relative z-10 transition-transform group-hover:scale-110">{icon}</div>
        <span className={`
          text-[8px] font-black uppercase mt-1 tracking-[0.2em] transition-all duration-300
          ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 absolute'}
        `}>
          {label}
        </span>
        {/* Glow effect matching the theme accent */}
        {isActive && (
          <div className="absolute inset-0 bg-brand/30 blur-xl transition-opacity animate-pulse" />
        )}
      </>
    )}
  </NavLink>
);

export default BottomNav;