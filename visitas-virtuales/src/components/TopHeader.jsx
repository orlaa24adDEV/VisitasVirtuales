import '../assets/App.css';

import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

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
    onLogout = () => { },
    userName = "Estudiante",
    userEmail = "estudiante@medac.es",
    userImg = "https://unavatar.io/x/unknow",
    role = "Estudiante",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redireccionar

    const handleLogoutClick = () => {
        onLogout(); // Limpia Context y LocalStorage
        setIsOpen(false);
        navigate('/login'); // Redirige al login
    };

    return (
        <header className="h-16 w-full bg-blue-100 border-b border-slate-100 flex items-center justify-between px-4 lg:justify-end lg:px-8 shadow-sm">
            <button onClick={onMenuClick} className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg lg:hidden">
                <Menu size={24} />
            </button>

            <div className="flex items-center gap-4">
                {isLog ? (
                    <div className="relative flex items-center gap-4">
                        <div className="flex flex-col items-end leading-tight">
                            <h2 className="text-sm font-bold text-slate-800">{userName}</h2>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-black/50">
                                {role}
                            </span>
                        </div>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="group flex items-center gap-2 focus:outline-none"
                        >
                            <div className="relative">
                                <img
                                    src={userImg}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 group-hover:border-blue-200 transition-all"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <>
                                <button
                                    className="fixed inset-0 z-10 cursor-default"
                                    onClick={() => setIsOpen(false)}
                                ></button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-xs text-slate-500 font-medium">Conectado</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{userEmail}</p>
                                    </div>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-semibold flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* ✅ Corregido: Usamos Link de react-router-dom */}
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-600  px-4 py-2 rounded-lg hover:text-white hover:bg-blue-600  transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/register" // O a tu ruta de registro si la tienes
                            className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Registrarte
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
