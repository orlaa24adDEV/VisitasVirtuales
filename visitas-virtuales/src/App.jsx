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
import Register from './components/Register.jsx';
import './assets/App.css';


function App() {
    const { user, logout, selectedCenter } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="w-full flex bg-white min-h-screen">
            {/* Solo mostramos el Sidebar si hay usuario logueado */}
            {user && <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
            
            <div className="flex-col flex w-full h-screen overflow-hidden">
                <TopHeader onMenuClick={() => setIsMobileMenuOpen(true)}
                    isLog={!!user}
                    onLogout={logout}
                    userName={user?.name || ''}
                    userEmail={user?.email || ''}
                    userImg={"https://unavatar.io/x/unknow"}
                    role={user?.role || ''}
                />

                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        {/* 1. MANEJO DE LA RUTA RAÍZ "/" */}
                        {/* Ahora la prioridad es: ¿Hay usuario? Si no, al Login. */}
                        <Route path="/" element={
                            !user 
                                ? <Navigate to="/login" replace /> 
                                : (selectedCenter ? <Navigate to="/home" replace /> : <Navigate to="/centros" replace />)
                        } />
                        <Route path="/register" element={<Register />} />

                        {/* Ruta de Login siempre accesible */}
                        <Route path="/login" element={!user ? <Login/> : <Navigate to="/" replace />} />

                        {/* 2. RUTAS PROTEGIDAS POR LOGIN */}
                        {user ? (
                            <>
                                {/* Si está logueado pero no tiene centro, solo puede ver la selección de centros */}
                                <Route path="/centros" element={<CenterSelectionPage />} />

                                {selectedCenter ? (
                                    <>
                                        <Route path="/home" element={<Home />} />
                                        <Route path="/listpois" element={<ListPois />} />
                                        <Route path="/perfil" element={<div className="p-10 text-center text-black text-3xl font-bold">Perfil de {selectedCenter.name}</div>} />
                                        <Route path="/mensajes" element={<div className="p-10 text-center text-black text-3xl font-bold">Mensajes de {selectedCenter.name}</div>} />

                                        {/* Rutas de Admin */}
                                        <Route path="/crud" element={<AdminRoute><Crud /></AdminRoute>} />
                                        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                                        <Route path="/historial" element={<AdminRoute><Historial /></AdminRoute>} />
                                        
                                        <Route path="*" element={<Navigate to="/home" replace />} />
                                    </>
                                ) : (
                                    /* Si está logueado pero intenta navegar sin centro, al selector */
                                    <Route path="*" element={<Navigate to="/centros" replace />} />
                                )}
                            </>
                        ) : (
                            /* 3. Si NO está logueado, cualquier ruta desconocida lo manda al Login */
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
