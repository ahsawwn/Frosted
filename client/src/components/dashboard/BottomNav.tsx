import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, ShoppingCart, ReceiptText, Boxes, 
  Users, Settings, ChevronLeft,
  MonitorCog, ChefHat, UserCircle, Ticket, ScrollText, Truck
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN'] },
  { path: '/pos', icon: ShoppingCart, label: 'Sales', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { path: '/kitchen', icon: ChefHat, label: 'Kitchen', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN'] },
  { path: '/delivery', icon: Truck, label: 'Delivery', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { path: '/inventory', icon: Boxes, label: 'Inventory', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN'] },
  { path: '/products', icon: MonitorCog, label: 'Catalog', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'] },
  { path: '/recipes', icon: ScrollText, label: 'Recipes', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'KITCHEN', 'CASHIER'] },
  { path: '/transactions', icon: ReceiptText, label: 'History', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { path: '/customers', icon: UserCircle, label: 'Customers', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'CASHIER'] },
  { path: '/coupons', icon: Ticket, label: 'Coupons', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'] },
  { path: '/staff', icon: Users, label: 'Staff', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'] },
  { path: '/settings', icon: Settings, label: 'Settings', roles: ['SUPERADMIN', 'ADMIN', 'MANAGER'] },
];

const BottomNav = () => {
  const [isHidden, setIsHidden] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"role": "ADMIN"}');

  const filteredItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 flex items-center gap-4">
      <nav className={`frosted-panel p-1.5 rounded-[2.5rem] border-2 border-white/5 shadow-glow flex items-center gap-1 transition-all duration-700 ${isHidden ? 'opacity-0 translate-y-20 pointer-events-none scale-90' : 'opacity-100 translate-y-0 scale-100'}`}>
        <div className="flex items-center gap-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-500 group
                ${isActive 
                  ? 'bg-brand text-white shadow-glow' 
                  : 'text-text-muted hover:bg-white/5 hover:text-brand'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-[7px] font-black uppercase tracking-[0.1em] mt-1 transition-all duration-500 whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <button 
        onClick={() => setIsHidden(!isHidden)}
        className={`
          w-14 h-14 rounded-full frosted-panel flex items-center justify-center 
          transition-all duration-700 hover:scale-110 active:scale-95 border-2 border-white/5 shadow-glow shrink-0
          ${isHidden ? 'bg-brand text-white' : 'bg-surface text-text-muted hover:text-brand'}
        `}
      >
        <ChevronLeft size={22} className={`transition-transform duration-700 ${isHidden ? 'rotate-180' : 'rotate-0'}`} />
      </button>
    </div>
  );
};

export default BottomNav;