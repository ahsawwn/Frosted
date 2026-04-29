import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, Trash2, ShieldCheck, MoreVertical, X, Check } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: 'USER' });

  const fetchUsers = async () => {
    const { data } = await axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/admin/users', newUser, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    setModalOpen(false);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Directory</h1>
          <p className="text-slate-500 text-sm">Manage staff access and permissions</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-4xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'SUPERADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-4 text-xs font-medium text-green-600 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                </td>
                <td className="px-8 py-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simplified Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6">Create New Staff</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input placeholder="Full Name" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              <input placeholder="Username" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setNewUser({...newUser, username: e.target.value})} required />
              <input placeholder="Email" type="email" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              <input placeholder="Password" type="password" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              <select className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="USER">Standard User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;