import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import  POS  from './pages/POS';
import  Inventory  from './pages/Inventory';
import Transactions from './pages/Transactions';
import Products from './pages/Products';
import Recipes from './pages/Recipes';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import ProductView from './pages/ProductView';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Kitchen from './pages/Kitchen';
import CustomerScreen from './pages/CustomerScreen';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      <ThemeProvider>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        {/* Customer Facing - Public but dedicated */}
        <Route path="/customer-screen" element={<CustomerScreen />} />

        {/* Protected Dashboard Shell */}
        {isAuthenticated ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductView />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;