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
    // Extraemos isAdmin y isTeacher para usarlos en las rutas
    const { user, logout, selectedCenter, isAdmin} = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="w-full flex bg-white min-h-screen">
            {/* Sidebar solo si hay login */}
            {user && (
                <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setIsMobileMenuOpen={setIsMobileMenuOpen} 
                />
            )}
            
            <div className="flex-col flex w-full h-screen overflow-hidden">
                <TopHeader 
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    isLog={!!user}
                    onLogout={logout}
                    userName={user?.username || user?.name || ''}
                    userEmail={user?.email || ''}
                    userImg={"https://unavatar.io/x/unknow"}
                    role={user?.role || ''}
                />

                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        {/* 1. MANEJO DE RUTAS PÚBLICAS */}
                        <Route path="/login" element={!user ? <Login/> : <Navigate to="/" replace />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={
                            !user 
                                ? <Navigate to="/login" replace /> 
                                : (selectedCenter ? <Navigate to="/home" replace /> : <Navigate to="/centros" replace />)
                        } />

                        {/* 2. RUTAS PROTEGIDAS (Requieren estar logueado) */}
                        {user ? (
                            <>
                                {/* Selección de centro (obligatorio antes de ver contenido) */}
                                <Route path="/centros" element={<CenterSelectionPage />} />

                                {selectedCenter ? (
                                    <>
                                        {/* Contenido General */}
                                        <Route path="/home" element={<Home />} />
                                        <Route path="/listpois" element={<ListPois />} />
                                        <Route path="/perfil" element={<div className="p-10 text-center text-black text-3xl font-bold">Perfil de {selectedCenter.name}</div>} />
                                        <Route path="/mensajes" element={<div className="p-10 text-center text-black text-3xl font-bold">Mensajes de {selectedCenter.name}</div>} />

                                        {/* ZONA DE GESTIÓN (Acceso: Admin y Profesores) */}
                                        {/* Usamos AdminRoute que ya permite a ambos */}
                                        <Route path="/crud" element={<AdminRoute><Crud /></AdminRoute>} />
                                        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

                                        {/* ZONA DE AUDITORÍA (Acceso: SOLO Admin) */}
                                        <Route 
                                            path="/historial" 
                                            element={isAdmin ? <AdminRoute><Historial /></AdminRoute> : <Navigate to="/home" replace />} 
                                        />
                                        
                                        <Route path="*" element={<Navigate to="/home" replace />} />
                                    </>
                                ) : (
                                    /* Si no ha seleccionado centro, cualquier ruta lo manda al selector */
                                    <Route path="*" element={<Navigate to="/centros" replace />} />
                                )}
                            </>
                        ) : (
                            /* Si no hay login, cualquier ruta manda al login */
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
