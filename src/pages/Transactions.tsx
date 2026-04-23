import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  Eye, Loader2, Search, ReceiptText, Printer, 
  Trash2, RefreshCw, ArrowUpDown 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReceiptModal from '../components/ReceiptModal'; // Adjust the path as needed

const TransactionPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error("Terminal Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openPreview = (order: any) => {
    // Transform order data to match the ReceiptModal's expected props
    const formattedData = {
      ...order,
      isDuplicate: true,
      subtotal: order.totalAmount / 1.15, // Reverse calculation for display if not in DB
      taxAmount: order.totalAmount - (order.totalAmount / 1.15),
      items: order.items.map((item: any) => ({
        name: item.product?.name || "Assorted Scoop",
        quantity: item.quantity,
        price: item.price
      }))
    };
    setSelectedOrder(formattedData);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("SECURITY ALERT: Void this transaction?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
      toast.success("Transaction Voided");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Delete Failed");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full max-w-[1850px] mx-auto px-6 py-4 space-y-4 h-[calc(100vh-2rem)] flex flex-col">
      
      {/* 1. COMPACT DASH HEADER */}
      <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-pink-500 shadow-lg">
            <ReceiptText size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Oftsy Ledger</h1>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Archive & Reprint Terminal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl items-center gap-6">
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase mb-1 tracking-widest">Total Sales</p>
                <p className="text-base font-black tabular-nums leading-none">₨ {orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
              </div>
           </div>
           <button onClick={fetchOrders} className="p-3 bg-slate-900 text-white hover:bg-pink-500 rounded-xl transition-all">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* 2. SLIM SEARCH */}
      <div className="relative shrink-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
          type="text"
          placeholder="Search by Invoice ID or Method (Cash/Card)..."
          className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 font-bold text-xs outline-none focus:ring-4 focus:ring-pink-500/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. TABLE AREA */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-50">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4"><div className="flex items-center gap-2">Invoice <ArrowUpDown size={10}/></div></th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-pink-500" /></td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-4">
                    <p className="font-black text-slate-900 text-xs">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{format(new Date(order.createdAt), 'MMM dd • hh:mm a')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      order.paymentMethod?.toUpperCase() === 'CARD' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {order.paymentMethod || 'CASH'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">
                    ₨ {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openPreview(order)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg transition-all" title="View & Print">
                        <Printer size={16} />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Void Transaction">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PROFESSIONAL RECEIPT MODAL */}
      <ReceiptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        orderData={selectedOrder} 
      />
    </div>
  );
};

export default TransactionPage;