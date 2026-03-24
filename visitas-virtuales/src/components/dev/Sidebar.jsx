import React, { useState } from 'react';
import { Home, User, Mail, Menu, LayoutDashboard, Building2, MapPin, ClipboardCheck} from 'lucide-react';
import logo1 from '../../assets/logo1.png';

const Sidebar = ({ onSelect, activeItem }) => {
// 1. Estado para saber si está expandida o contraída
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { id: 'inicio', name: 'Inicio', icon: <Home size={20} /> },
        { id: 'perfil', name: 'Perfil', icon: <User size={20} /> },
        { id: 'mensajes', name: 'Mensajes', icon: <Mail size={20} /> },
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={22} /> },
        { id: 'seleccion-centro', name: 'Selección de Centro', icon: <Building2 size={22} /> },
        { id: 'gestion-pois', name: 'Gestión de POIs', icon: <MapPin size={22} /> },
        { id: 'auditoria', name: 'Auditoría', icon: <ClipboardCheck size={22} /> },
    ];

    return (
    <div className={`flex h-screen flex-col bg-blue-600 text-white shadow-lg transition-all duration-300 
                    ${isExpanded ? 'w-64' : 'w-20'}`}>
        
        {/*Cabecera del sidebar*/}
        <div className="flex flex-col items-center gap-2 border-b border-blue-500 p-6">

            <img src={logo1} alt="Icono" className="h-12 w-12 object-contain rounded-lg" />
            
            {/*Texto davante que se contrae */}
            {isExpanded && (
                <span className="font-bold text-xl tracking-widest whitespace-nowrap">DAVANTE</span> 
            )}
            {!isExpanded && (
                <span className="font-bold text-xl tracking-widest whitespace-nowrap invisible">DAVANTE</span> 
            )}
        </div>

        {/*Lista de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-3">
            {menuItems.map((item) => (
                <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center rounded-lg px-4 py-3 transition-all duration-200 
                            ${activeItem === item.id ? 'bg-white text-blue-600 shadow-md font-bold' : 'hover:bg-blue-700 text-blue-100 hover:text-white'}
                            ${isExpanded ? 'justify-start gap-4' : 'justify-center'}`} 
                >
                    <div className="shrink-0">
                        {item.icon}
                    </div>
                    <span className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
                            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        {item.name}
                    </span>
                    {/* Aquí le decimos que se puede encojer el texto */}
                    {/*isExpanded && <span className="font-medium">{item.name}</span>*/}
                </button>
            ))}
        </nav>

        {/* Pie de la barra lateral */}
        <div className="border-t border-blue-500 p-4">
            <div className="flex items-center justify-center">
                
                {/* El botón de menú siempre presente */}
                <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-blue-700 p-2 rounded-full transition-colors"
                title="Expandir/Contraer"
                >
                    <Menu size={24} />
                </button>
            </div>
        </div>


    </div>
  );
};

export default Sidebar;
