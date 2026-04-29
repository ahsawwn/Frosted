import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  // Retrieve the user object from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={20} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">frosted Frosted</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink 
          to="/dashboard/inventory" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Package size={20} /> Inventory
        </NavLink>

        {/* --- CONDITIONAL TAB FOR SUPERADMIN ONLY --- */}
        {userRole === 'SUPERADMIN' && (
          <NavLink 
            to="/dashboard/users" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={20} /> User Directory
          </NavLink>
        )}
      </nav>

      <div className="pt-6 border-t border-slate-100 space-y-2">
        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Settings size={20} /> Settings
        </NavLink>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all mt-4"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
