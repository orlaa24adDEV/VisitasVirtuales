import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';
import { MainLayout } from './components/dev/layout/MainLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import {AdminLayout}   from './components/dev/layout/AdminLayout';
import Dashboard from './pages/Dashboard.jsx';
import Pois from './pages/Pois.jsx';
import Historial from './pages/Historial.jsx';
import { Outlet } from 'react-router-dom';
import CenterSelectionPage from './pages/CenterSelectionPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

//Ruta protegida con centro seleccionado y usuario autenticado
const ProtectedRoute = ({ children }) => {
    const { user, selectdCenter } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!selectdCenter) {
        return <Navigate to="/select-center" replace />;
    }
    return children;
};

//Ruta que solo necesita autenticacion pero no centro seleccionado
const AuthRoute = ({ children }) => {
    const { user , selectedCenter} = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    //Si ya tiene un centro, va directo al dashboard
    if(!selectedCenter) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};


function App() {
  return (
    <Routes>
      {/* Raíz → selección de centro */}
      <Route index element={<Navigate to="/select-center" replace />} />
 
      {/* Selección de centro: siempre accesible */}
      <Route path="/select-center" element={<CenterSelectionPage />} />
 
      {/* Layout con sidebar — rutas protegidas */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
      </Route>
 
      <Route
        path="/pois"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Pois />} />
      </Route>
 
      <Route
        path="/historial"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Historial />} />
      </Route>
 
      {/* 404 */}
      <Route path="*" element={<div className="p-10">404 - No encontrado</div>} />
    </Routes>
  );
}

export default App;
