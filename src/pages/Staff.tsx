import React from 'react';
import { UserPlus, Shield, MoreVertical } from 'lucide-react';

const Staff = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Team Members</h1>
          <p className="text-slate-500 text-sm font-medium">Manage access and roles for your shop.</p>
        </div>
        <button className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex gap-2 items-center">
          <UserPlus size={18} />
          <span className="font-bold text-sm">Add Member</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">AS</div>
                  <div>
                    <p className="text-sm font-black">Ahsan Shahid</p>
                    <p className="text-xs text-slate-400 font-medium">admin@oftsy.com</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Shield size={14} className="text-blue-500" />
                  SUPERADMIN
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Active</span>
              </td>
              <td className="px-8 py-6 text-right text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical size={18} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;