import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, Save, Utensils, 
  Info, ChevronRight, Loader2, Search 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  ingredients?: any[];
}

const Recipes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recipeRows, setRecipeRows] = useState<{ ingredientId: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, ingRes] = await Promise.all([
        axios.get('http://localhost:3000/api/products'),
        axios.get('http://localhost:3000/api/ingredients')
      ]);
      setProducts(prodRes.data);
      setIngredients(ingRes.data);
    } catch (err) {
      toast.error("Failed to load recipe data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
  setSelectedProduct(product);

  // Check if the product has the ingredients array from the backend
  if (product.ingredients && product.ingredients.length > 0) {
    // Map the database fields to your frontend state fields
    const loadedRecipe = product.ingredients.map(item => ({
      ingredientId: item.ingredientId,
      quantity: item.quantity
    }));
    setRecipeRows(loadedRecipe);
  } else {
    // Default empty row if no recipe exists
    setRecipeRows([{ ingredientId: '', quantity: 0 }]);
  }
};

  const addRow = () => setRecipeRows([...recipeRows, { ingredientId: '', quantity: 0 }]);

  const removeRow = (index: number) => {
    const updated = recipeRows.filter((_, i) => i !== index);
    setRecipeRows(updated);
  };

  const updateRow = (index: number, field: string, value: any) => {
    const updated = [...recipeRows];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeRows(updated);
  };

const saveRecipe = async () => {
  if (!selectedProduct) return;
  
  // Ensure we only send rows that have BOTH an ingredient selected and a quantity > 0
  const validIngredients = recipeRows.filter(
    (r) => r.ingredientId.trim() !== "" && r.quantity > 0
  );

  if (validIngredients.length === 0) {
    toast.error("Please add at least one valid ingredient");
    return;
  }

  try {
    await axios.post('http://localhost:3000/api/recipes', {
      productId: selectedProduct.id,
      ingredients: validIngredients
    });
    // ... rest of logic
  } catch (err) {
    console.error(err); // Look at the browser console for the specific error!
  }
  await fetchInitialData();
    toast.success("Recipe saved successfully!");
};

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">RECIPE BUILDER</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Link Menu Items to Warehouse Stock</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Product Selection */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden h-[70vh] flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  selectedProduct?.id === product.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-left">
                  <p className="font-black text-sm uppercase tracking-tight">{product.name}</p>
                  <p className={`text-[10px] font-bold ${selectedProduct?.id === product.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    ₨ {product.price}
                  </p>
                </div>
                <ChevronRight size={16} opacity={0.5} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Recipe Editor */}
        <div className="lg:col-span-8">
          {selectedProduct ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm min-h-[70vh] flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Recipe Configuration</p>
                  </div>
                </div>
                <button 
                  onClick={saveRecipe}
                  disabled={saving}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Recipe
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 mb-2">
                  <span className="col-span-7 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingredient</span>
                  <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                  <span className="col-span-2"></span>
                </div>

                {recipeRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left duration-300">
                    <div className="col-span-7">
                      <select 
                        value={row.ingredientId}
                        onChange={(e) => updateRow(index, 'ingredientId', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select Ingredient</option>
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3 relative">
                      <input 
                        type="number" 
                        value={row.quantity}
                        onChange={(e) => updateRow(index, 'quantity', parseFloat(e.target.value))}
                        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-500/20"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button 
                        onClick={() => removeRow(index)}
                        className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addRow}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-blue-200 hover:text-blue-500 transition-all flex items-center justify-center gap-2 mt-6"
                >
                  <Plus size={18} /> Add Component
                </button>
              </div>

              <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl flex gap-4 border border-blue-100/50">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                  <strong>How it works:</strong> When this product is sold in the POS, the system will automatically deduct these quantities from your warehouse stock. Ensure your units (kg vs grams) match your inventory settings.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 h-[70vh] flex flex-col items-center justify-center text-center p-10">
              <div className="p-6 bg-white rounded-[2rem] shadow-sm mb-6">
                <Utensils size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-400">SELECT A PRODUCT</h3>
              <p className="text-slate-400 text-sm max-w-[250px] font-medium mt-2">Pick a product from the left to start building its secret recipe.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;