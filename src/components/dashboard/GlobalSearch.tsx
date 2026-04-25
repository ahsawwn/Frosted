import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, X, Command, ArrowRight, Loader2, Package, ShoppingBag, Hash } from 'lucide-react';

const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[], orders: any[] }>({ products: [], orders: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // For keyboard navigation
  const navigate = useNavigate();
  
  // Combine results into a flat list for easier keyboard indexing
  const flatResults = [...results.products.map(p => ({ ...p, type: 'product' })), ...results.orders.map(o => ({ ...o, type: 'order' }))];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      
      if (flatResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % flatResults.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const item = flatResults[selectedIndex];
          handleItemClick(item.type === 'product' ? `/inventory/product/${item.id}` : `/pos/orders/${item.id}`);
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, flatResults, selectedIndex]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ products: [], orders: [] });
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/search?q=${query}`);
        setResults({ products: data.products || [], orders: data.orders || [] });
        setSelectedIndex(0); // Reset selection on new search
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box - Shadow Removed */}
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-900 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center p-5 gap-4 border-b-2 border-slate-100">
          {isLoading ? <Loader2 className="animate-spin text-pink-500" size={22} /> : <Search className="text-slate-400" size={22} />}
          <input
            autoFocus
            type="text"
            placeholder="Search Frosted terminal..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg border border-slate-200 text-[10px] font-black uppercase">
            Esc
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-hide">
          {flatResults.length > 0 ? (
            <div className="space-y-1">
              {flatResults.map((item, index) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleItemClick(item.type === 'product' ? `/inventory/product/${item.id}` : `/pos/orders/${item.id}`)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all text-left ${
                    index === selectedIndex ? 'bg-slate-900 text-white' : 'bg-transparent text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {item.type === 'product' ? <Package size={18} className="opacity-50" /> : <ShoppingBag size={18} className="opacity-50" />}
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.name || `Order #${item.id.slice(-6).toUpperCase()}`}</span>
                      <span className={`text-[10px] font-bold uppercase ${index === selectedIndex ? 'text-slate-400' : 'text-slate-400'}`}>
                        {item.type} • {item.category?.name || 'Retail'}
                      </span>
                    </div>
                  </div>
                  {index === selectedIndex && <ArrowRight size={16} className="animate-in slide-in-from-left-2" />}
                </button>
              ))}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="py-12 text-center text-slate-400 font-bold italic">No records found.</div>
          ) : (
            <div className="py-20 text-center text-slate-300">
               <Command className="mx-auto mb-2 opacity-20" size={40} />
               <p className="text-xs font-black uppercase tracking-widest">Global Terminal Search</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <div className="flex gap-4">
              <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-90"/> <ArrowRight size={10} className="-rotate-90"/> Move</span>
              <span className="flex items-center gap-1 text-pink-500"><Hash size={10} /> Select</span>
           </div>
           <span>v4.0.2-Oxygen</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;