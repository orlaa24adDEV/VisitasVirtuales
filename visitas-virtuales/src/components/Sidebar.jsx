import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import {
    Home,
    User,
    Mail,
    Menu,
    LayoutDashboard,
    Building2,
    MapPin,
    ClipboardCheck,
    X,
    Database, // Icono extra para el CRUD si quieres
} from 'lucide-react';
import logo1 from '@/assets/logo1.png';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { isAdmin } = useAuth();

    // Definimos todos los items y marcamos cuáles son solo para Admin
    const allMenuItems = [
        { id: 'inicio', name: 'Inicio', icon: <Home size={20} />, path: 'home' },
        { id: 'perfil', name: 'Perfil', icon: <User size={20} />, path: 'login' },
        { id: 'mensajes', name: 'Mensajes', icon: <Mail size={20} />, path: 'mensajes' },
        { id: 'seleccion-centro', name: 'Selección de Centro', icon: <Building2 size={22} />, path: '/centros'},
        // Gestión de POIs incluye también /crud
        { 
            id: 'gestion-pois', 
            name: 'Gestión de POIs', 
            icon: <MapPin size={22} />, 
            path: 'listpois', 
            extraActivePaths: ['/crud'], // Para marcar activo también en /crud
        },
        // Items solo para ADMIN
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard', adminOnly: true },
        { id: 'auditoria', name: 'Auditoría', icon: <ClipboardCheck size={22} />, path: '/historial', adminOnly: true },
    ];

    // Filtramos la lista: si no es admin, quitamos los que tengan adminOnly: true
    const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <>
            {/* OVERLAY: Capa oscura móvil */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR PRINCIPAL */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-blue-600 text-white shadow-lg transition-all duration-300 lg:relative
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isExpanded ? 'w-64' : 'lg:w-20'}`}>
                
                {/* Cabecera */}
                <div className="flex flex-col items-center gap-2 border-b border-blue-500 p-6 relative">
                    <button 
                        className="absolute top-4 right-4 lg:hidden p-1 hover:bg-blue-700 rounded"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={logo1}
                        alt="Icono"
                        className="h-12 w-12 object-contain rounded-lg cursor-pointer"
                    />
                    <span
                        className={`font-bold text-xl tracking-widest whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : ' lg:opacity-0 lg:invisible'}`}>
                        DAVANTE
                    </span>
                </div>

                {/* Lista de Navegación filtrada */}
                <nav className="flex-1 px-4 py-6 space-y-3">
                    {menuItems.map((item) => {
                        // Custom active logic for 'Gestión de POIs' to include /crud
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                                }}
                                className={({ isActive, isPending, location }) => {
                                    let active = isActive;
                                    // Defensive: location may be undefined in some react-router-dom versions
                                    const currentPath = location && location.pathname ? location.pathname : window.location.pathname;
                                    if (item.extraActivePaths && item.extraActivePaths.length > 0) {
                                        if (item.extraActivePaths.some(p => currentPath.startsWith(p))) {
                                            active = true;
                                        }
                                    }
                                    return `flex w-full items-center rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 
                                        ${active ? 'bg-white text-blue-600 shadow-md font-bold' : 'hover:bg-blue-700 text-blue-100 hover:text-white'}
                                        ${isExpanded ? 'justify-start gap-4' : 'lg:justify-center'}`;
                                }}
                            >
                                <div className="shrink-0">{item.icon}</div>
                                <span
                                    className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
                                    ${isExpanded ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0'}`}>
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Pie: Botón colapsar */}
                <div className="hidden lg:block border-t border-blue-500 p-4">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors"
                            title="Expandir/Contraer">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
