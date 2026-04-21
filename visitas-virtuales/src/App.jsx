// eslint-disable-next-line no-unused-vars
import { use, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Añadimos Navigate
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Crud from './components/Crud';
import Dashboard from './pages/Dashboard.jsx';
import Historial from './pages/Historial.jsx';
import CenterSelectionPage from './pages/CenterSelectionPage.jsx';
import ListPois from './pages/ListPois.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import Home from './pages/Home.jsx';
import { AdminRoute } from './components/ProtectedRoute.jsx';
import './assets/App.css';
//eslint-disable-next-line no-unused-vars
import { Toaster, toast } from 'sonner';
import LandingPage from './pages/LandingPage.jsx';


function App() {
    const { user, logout, selectedCenter, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Detectamos si es la Landing para limpiar el diseño
    const isLanding = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/centros';

    return (
        <div className="w-full flex bg-white min-h-screen">
            {/* Sidebar: SOLO para usuarios logueados y fuera de la Landing */}
            {user && !isLanding && (
                <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setIsMobileMenuOpen={setIsMobileMenuOpen} 
                />
            )}
            
            <div className="flex-col flex w-full h-screen relative">
                {/* Header: Se oculta en Landing. Muestra 'Invitado' si no hay user */}
                {!isLanding && (
                    <TopHeader 
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        isLog={!!user}
                        onLogout={logout}
                        userName={user?.username || 'Invitado'}
                        userEmail={user?.email || ''}
                        role={user?.role || 'guest'}
                    />
                )}

                <main className={`flex-1 ${isLanding ? '' : 'overflow-y-auto'}`}>
                    <Routes>
                        {/* 1. LANDING: Punto de entrada total */}
                        <Route path="/" element={<LandingPage />} />

                        {/* 2. ACCESO ADMIN/PROFE */}
                        <Route path="/login" element={!user ? <Login/> : <Navigate to="/home" replace />} />

                        {/* 3. SELECCIÓN DE CENTROS: Pública para el invitado */}
                        <Route path="/centros" element={<CenterSelectionPage />} />

                        {/* 4. EL HOME (ESCENA UNITY): 
                               Accesible si hay un centro seleccionado (sea invitado o admin) */}
                        <Route 
                            path="/home" 
                            element={selectedCenter ? <Home /> : <Navigate to="/centros" replace />} 
                        />

                        {/* 5. RUTAS BLOQUEADAS PARA INVITADOS (Solo Admin/Profe) */}
                        <Route 
                            path="/listpois" 
                            element={user ? <ListPois centerId={selectedCenter?.id} /> : <Navigate to="/login" replace />} 
                        />
                        <Route path="/crud" element={<AdminRoute><Crud /></AdminRoute>} />
                        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                        <Route 
                            path="/historial" 
                            element={isAdmin ? <AdminRoute><Historial /></AdminRoute> : <Navigate to="/home" replace />} 
                        />

                        {/* 6. REDIRECCIÓN FINAL: Si se pierde, vuelve a la Landing */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
            <Toaster richColors position='top-right' />
        </div>
    );
}
export default App;
