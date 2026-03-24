import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';
import { MainLayout } from './components/dev/layout/MainLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import {AdminLayout}   from './components/dev/layout/AdminLayout';
import Dashboard from './pages/Dashborad.jsx';
import Pois from './pages/Pois.jsx';
import Historial from './pages/Historial.jsx';
import { Outlet } from 'react-router-dom';


function App() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                {/* Redirección inicial */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Rutas Hijas conectadas a sus componentes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pois" element={<Pois />} />
                <Route path="historial" element={<Historial />} />

                {/* 404 opcional */}
                <Route path="*" element={<div className="p-10">404 - No encontrado</div>} />
            </Route>
        </Routes>
    );
}

export default App;
