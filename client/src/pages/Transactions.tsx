import { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { 
  Loader2, Search, ReceiptText, Printer, 
  Trash2, RefreshCw, ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReceiptModal from '../components/ReceiptModal';

const TransactionPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error("Telemetry Link Failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openPreview = (order: any) => {
    const formattedData = {
      ...order,
      isDuplicate: true,
      subtotal: order.subtotal, 
      taxAmount: order.taxAmount,
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
    if(!window.confirm("CRITICAL_SECURITY_ALERT: Void this node transaction?")) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
      toast.success("Transaction Voided");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Purge Protocol Fail");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: TRANSACTION LEDGER */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-text-main rounded-2xl flex items-center justify-center text-brand shadow-glow animate-pulse">
            <ReceiptText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              Order <span className="text-brand">History</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mt-1.5 focus:border-brand">Record of all past sales</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-10 bg-panel border-2 border-border-frosted px-8 py-4 rounded-2xl">
              <div className="flex flex-col gap-0.5">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] leading-none">Total Revenue</p>
                <p className="text-xl font-black text-text-main tabular-nums leading-none tracking-tighter">₨ {orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className="w-[1.5px] h-6 bg-border-frosted" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] leading-none">Total Orders</p>
                <p className="text-xl font-black text-brand tabular-nums leading-none tracking-tighter">{orders.length}</p>
              </div>
           </div>
           <button onClick={fetchOrders} className="p-4 bg-brand text-white hover:scale-[1.02] active:scale-95 rounded-xl shadow-glow transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* SEARCH COMMAND */}
      <div className="relative shrink-0 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-brand transition-all" size={20} />
        <input 
          type="text"
          placeholder="Search by Order ID..."
          className="w-full bg-surface border-2 border-border-frosted rounded-2xl py-5 pl-16 pr-8 font-black text-[10px] outline-none focus:border-brand transition-all placeholder:text-text-muted/30 uppercase tracking-[0.1em]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LEDGER DATA TABLE */}
      <div className="industrial-card rounded-[2.5rem] border-2 border-white/5 flex-1 overflow-hidden flex flex-col bg-surface/30 backdrop-blur-3xl">
        <div className="overflow-y-auto flex-1 no-scrollbar p-4">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 z-10">
              <tr className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                <th className="px-8 py-3"><div className="flex items-center gap-2">Order ID <ArrowUpDown size={12}/></div></th>
                <th className="px-8 py-3">Payment</th>
                <th className="px-8 py-3">Total Paid</th>
                <th className="px-8 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-brand" size={48} /></td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-surface transition-all">
                  <td className="px-10 py-7 bg-panel/30 first:rounded-l-[2rem] border-y-2 border-l-2 border-transparent group-hover:border-border-frosted border-l-transparent group-hover:bg-surface">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-text-main rounded-2xl flex items-center justify-center text-brand text-[10px] font-black shadow-glow">#{order.id.slice(-4).toUpperCase()}</div>
                       <div>
                          <p className="font-black text-text-main text-sm uppercase tracking-widest font-mono">ID: {order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase mt-1 opacity-50">{format(new Date(order.createdAt), 'MMM dd • hh:mm:ss a')}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-7 bg-panel/30 border-y-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                      order.paymentMethod?.toUpperCase() === 'CARD' 
                        ? 'bg-brand/10 text-brand border-brand/20 shadow-glow' 
                        : 'bg-white/5 text-text-muted border-border-frosted'
                    }`}>
                      {order.paymentMethod || 'CASH'}
                    </span>
                  </td>
                  <td className="px-10 py-7 bg-panel/30 border-y-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface font-black text-text-main text-xl tabular-nums italic">
                    ₨ {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-10 py-7 bg-panel/30 last:rounded-r-[2rem] border-y-2 border-r-2 border-transparent group-hover:border-border-frosted group-hover:bg-surface text-right border-r-transparent">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={() => openPreview(order)} className="p-4 bg-surface text-text-muted hover:text-brand hover:border-brand border-2 border-border-frosted rounded-2xl transition-all shadow-sm" title="Re-Print">
                        <Printer size={20} />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-4 bg-surface text-text-muted hover:text-red-500 hover:border-red-500 border-2 border-border-frosted rounded-2xl transition-all shadow-sm" title="Void Order">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        orderData={selectedOrder} 
      />
    </div>
  );
};

export default TransactionPage;
