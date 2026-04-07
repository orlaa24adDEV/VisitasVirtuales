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
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';

function App() {
    const { selectedCenter } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="w-full flex bg-white min-h-screen">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <div className="flex-col flex w-full h-screen overflow-hidden">
                <TopHeader onMenuClick={() => setIsMobileMenuOpen(true)}/>

                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        {/* 1. MANEJO DE LA RUTA RAÍZ "/" */}
                        <Route path="/" element={
                            selectedCenter 
                                ? <Navigate to="/home" replace /> 
                                : <Navigate to="/centros" replace />
                        } />

                        {/* Rutas siempre disponibles */}
                        <Route path="/login" element={<Login/>} />
                        <Route path="/centros" element={<CenterSelectionPage />} />

                        {/* 2. RUTAS CONDICIONALES */}
                        {selectedCenter ? (
                            <>
                                <Route path="/home" element={<Home />} />
                                <Route path="/listpois" element={<ListPois idCentro={selectedCenter.idCentro ?? selectedCenter.id} />} />
                                <Route path="/crud" element={<Crud />} />
								<Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/historial" element={<Historial />} />
                                <Route path="/perfil" element={<div className="p-10 text-center text-black text-3xl font-bold">Perfil de {selectedCenter.name}</div>} />
                                <Route path="/mensajes" element={<div className="p-10 text-center text-black text-3xl font-bold">Mensajes de {selectedCenter.name}</div>} />
                                
                                {/* Si intenta ir a una ruta que no existe, pero tiene centro, lo mandamos a home */}
                                <Route path="*" element={<Navigate to="/home" replace />} />
                            </>
                        ) : (
                            <>
                                {/* 3. PROTECCIÓN: Si NO hay centro y trata de entrar a cualquier otra cosa, 
                                     lo mandamos a /centros automáticamente */}
                                <Route path="*" element={<Navigate to="/centros" replace />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;