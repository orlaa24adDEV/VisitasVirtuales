 
import '../assets/App.css';

import { ChevronDown, LogOut, Menu, User, Home, MapPin, Compass } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { useAuth} from '@/hooks/useAuth.js';
import Button from './Button.jsx';
import CenterSelectButton from './CenterSelectButton.jsx';
import ClickOutsideWrapper from './ClickOutsideWrapper.jsx';

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
    const { selectedCenter, user } = useAuth(); // Obtenemos el centro del contexto

    const handleLogoutClick = () => {
        onLogout();
        setIsOpen(false);
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between px-4 lg:justify-end lg:px-8 bg-slate-50/80 backdrop-blur-xl border-b border-blue-100/50
                    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] 
                    transition-all">
            <Button variant='ghost' size='normal' className="lg:hidden" onClick={onMenuClick}>
                <Menu size={22} />
            </Button>
            {!user ? (
                <h1 className="hidden lg:flex gap-2 text-lg font-semibold text-slate-800 justify-center items-center">
                <Compass size={22} strokeWidth={2} className='text-slate-800'/>
                Visita 360º
            </h1>) : null
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
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50">
                                        {role}
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
                                <div className="absolute py-1 right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 pb-3 pt-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-xs text-slate-500 font-medium">Conectado</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{userEmail}</p>
                                    </div>
                                    <hr className="my-1 border-slate-200" />
                                    <button
                                        onClick={() => { navigate('/perfil'); setIsOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-slate-50 font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <User className="w-4 h-4 text-neutral-800" />
                                        Mi Perfil
                                    </button>
                                    <hr className="my-1 border-slate-200" />
                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
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

