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

        {/* Protected Dashboard Shell */}
        {isAuthenticated ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          /* Fallback: If no token and trying to access dashboard, go to login */
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;