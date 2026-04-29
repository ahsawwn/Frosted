import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { 
  Plus, Trash2, Save, Utensils, 
  ChevronRight, Loader2, Search,
  X, Ruler, Layers, ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Unit {
  id: string;
  name: string;
  short: string;
}

interface Ingredient {
  id: string;
  name: string;
}

interface RecipeItem {
  ingredientId: string;
  quantity: number;
  unitId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  ingredients?: RecipeItem[]; 
}

interface RecipeRow {
  ingredientId: string;
  quantity: number;
  unitId: string;
}

// API config removed

const Recipes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recipeRows, setRecipeRows] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', short: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, ingRes, unitRes] = await Promise.all([
        api.get('/products'),
        api.get('/ingredients'),
        api.get('/units')
      ]);
      setProducts(prodRes.data);
      setIngredients(ingRes.data);
      setUnits(unitRes.data);
    } catch (err) {
      toast.error("Telemetry failed to sync");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    if (product.ingredients && product.ingredients.length > 0) {
      setRecipeRows(product.ingredients.map(item => ({
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        unitId: item.unitId
      })));
    } else {
      setRecipeRows([{ ingredientId: '', quantity: 0, unitId: '' }]);
    }
  };

  const updateRow = (index: number, field: keyof RecipeRow, value: any) => {
    const updated = [...recipeRows];
    if (field === 'quantity') {
      updated[index][field] = value === '' ? 0 : Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setRecipeRows(updated);
  };

  const saveRecipe = async () => {
    if (!selectedProduct) return;
    const validRows = recipeRows.filter(r => 
      r.ingredientId.trim() !== '' && 
      r.unitId.trim() !== '' && 
      r.quantity > 0
    );
    if (validRows.length === 0) return toast.error("BOM Structure Violation");

    setSaving(true);
    try {
      await api.post('/ingredients/recipe', {
        productId: selectedProduct.id,
        ingredients: validRows
      });
      toast.success("BOM Protocol Deployed");
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);
      const updatedProduct = prodRes.data.find((p: Product) => p.id === selectedProduct.id);
      if (updatedProduct) setSelectedProduct(updatedProduct);
    } catch (err) {
      toast.error("Deployment failed: Write Error");
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center opacity-20">
      <Loader2 className="animate-spin text-brand mb-6" size={64} />
      <p className="font-black text-xs uppercase tracking-widest text-text-main">Waking_Recipe_Engine...</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-6 theme-transition overflow-hidden">
      
      {/* HUD: BOM CONTROLLER */}
      <div className="flex justify-between items-center glass-panel p-6 rounded-[2.5rem] border-2 border-white/5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase italic leading-none">
              frosted <span className="text-brand">Recipes</span>
            </h1>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mt-1.5 focus:border-brand">Composition Protocol</p>
          </div>
        </div>

        <button 
          onClick={() => setIsUnitModalOpen(true)}
          className="flex items-center gap-2.5 px-8 py-4 bg-panel border-2 border-border-frosted rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-surface hover:border-brand transition-all shadow-sm"
        >
          <Ruler size={18} className="text-brand" /> Units.sys
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 min-w-0">
        
        {/* SIDEBAR: PRODUCT DOMAINS */}
        <div className="w-1/3 glass-panel rounded-[2.5rem] p-6 border-2 border-white/5 flex flex-col min-h-0">
          <div className="relative mb-6 shrink-0">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Query product nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase outline-none focus:border-brand transition-all"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${
                  selectedProduct?.id === product.id ? 'bg-brand border-brand text-white shadow-glow' : 'bg-panel border-transparent hover:border-brand/30 text-text-muted hover:text-text-main'
                }`}
              >
                <div className="text-left">
                  <p className="font-black text-[11px] uppercase tracking-widest leading-none">{product.name}</p>
                  <p className={`text-[9px] font-black uppercase mt-1 tracking-widest ${selectedProduct?.id === product.id ? 'text-white/60' : 'text-text-muted/40'}`}>Node_{product.id.slice(-4).toUpperCase()}</p>
                </div>
                <ChevronRight size={14} className={selectedProduct?.id === product.id ? 'text-white' : 'text-text-muted'} />
              </button>
            ))}
          </div>
        </div>

        {/* EDITOR: BOM COMPOSITION */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {selectedProduct ? (
            <div className="industrial-card p-8 flex flex-col flex-1 border-2 border-white/5 min-h-0 bg-surface/50 backdrop-blur-3xl">
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-text-main text-brand rounded-2xl flex items-center justify-center shadow-glow">
                    <Utensils size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter italic">{selectedProduct.name}</h2>
                    <p className="text-brand text-[9px] font-black uppercase tracking-[0.3em] mt-1">Resource Selection Protocol</p>
                  </div>
                </div>
                <button 
                  onClick={saveRecipe} 
                  disabled={saving} 
                  className="bg-brand text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-3 shadow-glow disabled:opacity-20 border-2 border-brand/20"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Deploy_Protocol
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                <div className="grid grid-cols-12 gap-6 px-8 mb-4">
                  <span className="col-span-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Resource_Node</span>
                  <span className="col-span-3 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Quantity</span>
                  <span className="col-span-3 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Protocol_Unit</span>
                </div>

                {recipeRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="col-span-6">
                      <div className="relative group">
                        <select 
                          value={row.ingredientId}
                          onChange={(e) => updateRow(index, 'ingredientId', e.target.value)}
                          className="w-full bg-panel border-2 border-border-frosted rounded-xl py-3 px-4 text-[10px] font-black uppercase outline-none focus:border-brand transition-all appearance-none"
                        >
                          <option value="">Select Resource...</option>
                          {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        value={row.quantity || ''}
                        onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                        className="w-full bg-panel border-2 border-border-frosted rounded-2xl p-6 text-sm font-black outline-none focus:border-brand transition-all text-center"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2">
                       <div className="relative group">
                        <select 
                          value={row.unitId}
                          onChange={(e) => updateRow(index, 'unitId', e.target.value)}
                          className="w-full bg-panel border-2 border-border-frosted rounded-2xl p-6 text-[11px] font-black uppercase outline-none focus:border-brand transition-all appearance-none"
                        >
                          <option value="">Unit...</option>
                          {units.map(u => <option key={u.id} value={u.id}>{u.short}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => setRecipeRows(recipeRows.filter((_, i) => i !== index))} className="p-4 bg-panel text-text-muted hover:text-red-500 border-2 border-border-frosted hover:border-red-500 rounded-2xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setRecipeRows([...recipeRows, { ingredientId: '', quantity: 0, unitId: '' }])}
                  className="w-full py-8 border-2 border-dashed border-border-frosted rounded-[2.5rem] text-text-muted font-black uppercase text-[10px] tracking-[0.5em] hover:border-brand hover:text-brand hover:bg-brand/5 transition-all mt-10 flex items-center justify-center gap-4"
                >
                  <Plus size={24} /> Integrate_New_Resource_Stream
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-surface/20 rounded-[3.5rem] border-4 border-dashed border-border-frosted flex flex-col items-center justify-center text-center p-12 backdrop-blur-sm">
              <div className="w-32 h-32 bg-panel rounded-[3rem] flex items-center justify-center text-text-muted/20 mb-8">
                <Utensils size={64} />
              </div>
              <h3 className="text-3xl font-black text-text-muted/40 uppercase tracking-tighter italic">Awaiting_Catalog_Selection</h3>
              <p className="text-[10px] font-black text-text-muted/30 uppercase tracking-[0.4em] mt-4">Select product node from shard to begin composition</p>
            </div>
          )}
        </div>
      </div>

      {/* UNIT PROTOCOL MODAL */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-text-main/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-xl rounded-[4rem] shadow-glow overflow-hidden p-12 border-2 border-brand/20 relative">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand/10 blur-3xl" />
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter italic leading-none">Units_Library.dll</h3>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-3">Measurement Meta Data</p>
              </div>
              <button 
                onClick={() => setIsUnitModalOpen(false)}
                className="p-4 bg-panel border-2 border-border-frosted rounded-2xl text-text-muted hover:text-brand transition-all"
              ><X size={24}/></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Protocol_Name</label>
                <input placeholder="Gram / Litre / Unit" value={newUnit.name} onChange={(e) => setNewUnit({...newUnit, name: e.target.value})} className="w-full bg-panel border-2 border-border-frosted rounded-3xl p-6 text-xs font-black uppercase outline-none focus:border-brand transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] ml-2">Short_Pointer</label>
                <input placeholder="gm / ltr / qty" value={newUnit.short} onChange={(e) => setNewUnit({...newUnit, short: e.target.value})} className="w-full bg-panel border-2 border-border-frosted rounded-3xl p-6 text-xs font-black uppercase outline-none focus:border-brand transition-all" />
              </div>
              <button onClick={() => {
                if (!newUnit.name || !newUnit.short) return toast.error("Memory Allocation Fail");
                api.post('/units', newUnit).then(res => {
                  setUnits([...units, res.data]);
                  setNewUnit({ name: '', short: '' });
                  toast.success("Memory Written");
                });
              }} className="w-full py-7 bg-brand text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-glow border-2 border-brand/20 mt-4">Compile_New_Protocol</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
