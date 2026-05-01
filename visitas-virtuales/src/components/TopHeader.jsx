 
import '../assets/App.css';

import { ChevronDown, LogOut, Menu, Compass, Settings } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import Button from './Button.jsx';
import CenterSelectButton from './CenterSelectButton.jsx';
import ClickOutsideWrapper from './ClickOutsideWrapper.jsx';
import DropdownItem from './DropdownItem.jsx';
import { useCenter } from '../hooks/useCenter.js';


TopHeader.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
    isLog: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    userImg: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
};

/**
 * TopHeader — Barra superior de la aplicación
 *
 * Uso:
 * <TopHeader
 *     isLog={isLog}                    > boolean, si el usuario está logueado
 *     onLogin={handleLogin}            > función, se ejecuta al iniciar sesión
 *     onLogout={handleLogout}          > función, se ejecuta al cerrar sesión
 *     userName="Bruno García"          > nombre de usuario
 *     userEmail="bruno@mail.com"       > email de usuario
 *     userImg="https://..."            > avatar de usuario
 *     role="Administrador"             > rol de usuario
 * />
 */

// Datos de sesión del usuario y acción de salida para el navbar.
export default function TopHeader({
    onMenuClick,
    isLog = true,
    onLogout = () => {},
    userName = "Estudiante",
    userEmail = "estudiante@medac.es",
    userImg = "https://unavatar.io/x/unknow",
    role = "Estudiante",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedCenter } = useCenter();


    const handleLogoutClick = () => {
        onLogout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between px-4 lg:justify-end lg:px-8 bg-slate-50/80 backdrop-blur-xl border-b border-blue-100/50
                    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] 
                    transition-all">
            {user ? (
                <Button variant='ghost' size='normal' className="lg:hidden" onClick={onMenuClick}>
                <Menu size={22} />
            </Button>
            ) : null}
            {!user ? (
                <Link to="/">
                    <h1 className=" lg:flex gap-2 text-lg font-semibold text-slate-800 justify-center items-center">
                    <Compass size={22} strokeWidth={2} className='text-slate-800'/>
                    Visita 360º
                    </h1>
                </Link>
            ) : null
            }
            <div className={`flex items-center ml-auto ${user ? 'gap-6' : 'gap-4'}`}>
                
                {/* --- BOTÓN CAMBIAR CENTRO --- */}
                {selectedCenter && (
                    <CenterSelectButton
                        centerName={selectedCenter.name}
                        onClick={() => navigate('/centros')}
                    />
                )}

                {isLog ? (
                    <ClickOutsideWrapper onClickOutside={() => setIsOpen(false)}>
                        <div className="relative flex items-center gap-6">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="group flex items-center gap-4 focus:outline-none cursor-pointer"
                            >
                                <div className="flex flex-col items-end leading-tight">
                                    <h2 className="text-sm font-bold text-slate-800">{userName}</h2>
                                    <span className={`px-1.75 py-0.75 rounded text-[11px] font-semibold uppercase ${
                                        role === 'admin' ? 'bg-blue-100/50 text-blue-600' : 
                                        role === 'teacher' ? 'bg-amber-50 text-amber-700' : 
                                        'bg-transparent text-zinc-400 border-zinc-200'
                                    }`}> {role === 'admin' ? 'Administrador' : role === 'teacher' ? 'Profesor' : 'Invitado'}
                                    </span>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <div className="relative">
                                        <img
                                            src={userImg}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 group-hover:border-blue-200 transition-all"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute outline py-px outline-slate-100 right-0 divide-y divide-slate-200 gap-3 top-full mt-2 w-56 bg-white rounded-xl shadow-lg/8 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="bg-slate-50/50 py-3.25 px-4">
                                        <p className="text-xs text-slate-500 font-medium">Conectado</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{userEmail}</p>
                                    </div>
                                    {role === 'admin' || role === 'teacher' ? (
                                        <DropdownItem onClick={() => navigate('/settings')}>
                                            <Settings size={16} />
                                            Configuración
                                        </DropdownItem>
                                    ) : null}
                                    <DropdownItem onClick={handleLogoutClick} className='hover:bg-red-50! text-red-500!'>
                                        <LogOut size={16}/>
                                        Cerrar sesión
                                    </DropdownItem>
                                </div>
                            )}
                        </div>
                    </ClickOutsideWrapper>
                    ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                        >
                            <Button variant="primary" size="normal" type="button">
                            Iniciar sesión
                            </Button>
                        </Link>
                        
                    </div>
                )}
            </div>
        </header>
    );
}

