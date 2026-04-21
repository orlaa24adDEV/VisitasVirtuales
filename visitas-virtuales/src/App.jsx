import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Añadimos Navigate
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
import LandingPage from './pages/LandingPage.jsx';


function App() {
    const { user, logout, selectedCenter, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Verificamos si estamos en la landing para limpiar la interfaz
    const isLanding = window.location.pathname === '/';

    return (
        <div className="w-full flex bg-white min-h-screen">
            {/* Sidebar: Solo si hay login y NO estamos en la landing */}
            {user && !isLanding && (
                <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setIsMobileMenuOpen={setIsMobileMenuOpen} 
                />
            )}
            
            <div className="flex-col flex w-full h-screen overflow-hidden">
                {/* Header: Solo si NO estamos en la landing (la landing suele tener su propio header) */}
                {!isLanding && (
                    <TopHeader 
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        isLog={!!user}
                        onLogout={logout}
                        userName={user?.username || user?.name || ''}
                        userEmail={user?.email || ''}
                        userImg={"https://unavatar.io/x/unknow"}
                        role={user?.role || ''}
                    />
                )}

                <main className={`flex-1 ${isLanding ? '' : 'overflow-y-auto'}`}>
                    <Routes>
                        {/* --- RUTAS PÚBLICAS ABIERTAS --- */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/centros" element={<CenterSelectionPage />} />
                        
                        {/* Login: ya está logueado, redirige al home */}
                        <Route path="/login" element={!user ? <Login/> : <Navigate to="/home" replace />} />

                        {/* --- RUTAS PROTEGIDAS (Requieren Login) --- */}
                        {user ? (
                            <>
                                {selectedCenter ? (
                                    <>
                                        <Route path="/home" element={<Home />} />
                                        <Route path="/listpois" element={<ListPois centerId={selectedCenter.id} />} />
                                        <Route path="/perfil" element={<div className="p-10 text-center text-black text-3xl font-bold">Perfil de {selectedCenter.name}</div>} />
                                        
                                        {/* ZONA GESTIÓN */}
                                        <Route path="/crud" element={<AdminRoute><Crud /></AdminRoute>} />
                                        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

                                        {/* ZONA AUDITORÍA */}
                                        <Route 
                                            path="/historial" 
                                            element={isAdmin ? <AdminRoute><Historial /></AdminRoute> : <Navigate to="/home" replace />} 
                                        />
                                        
                                        {/* Redirección por defecto si está logueado y tiene centro */}
                                        <Route path="*" element={<Navigate to="/home" replace />} />
                                    </>
                                ) : (
                                    /* Si está logueado pero no eligió centro */
                                    <Route path="*" element={<Navigate to="/centros" replace />} />
                                )}
                            </>
                        ) : (
                            /* Si no hay login y no es una ruta pública, al login */
                            <Route path="*" element={<Navigate to="/" replace />} />
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
