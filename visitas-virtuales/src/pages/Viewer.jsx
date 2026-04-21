import { useAuth } from '@/hooks/useAuth.js';
import { useCenterQuery } from '@/hooks/useCenterQuery.js';
import { UserCheck, ShieldCheck, GraduationCap } from 'lucide-react'; // Iconos para darle estilo
import UnityViewer from '../components/UnityViewer';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Button from '../components/Button';

export default function Viewer() {
    const { user, isAdmin, isTeacher, selectedCenter } = useAuth();
    const navigate = useNavigate();

    // Si el context no contiene un centro, utilizar el query param "center" de la URL, 
    // proporcionado por la página de selección de centro. Esto es un fallback y además
    // permite compartir URLs directas a centros específicos.
    useCenterQuery();

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    {/* Icono dinámico según el rol */}
                    <div className={`p-3 rounded-full transition-colors ${
                        isAdmin ? 'bg-rose-100 text-rose-600' : 
                        isTeacher ? 'bg-sky-100 text-sky-600' : 
                        'bg-gray-100 text-slate-400'
                    }`}>
                        {/* 1. Si es Admin, SOLO esto */}
                        {isAdmin ? (
                            <ShieldCheck size={32} />
                        ) : isTeacher ? (
                        /* 2. Si no es Admin pero es Profe, SOLO esto */
                            <GraduationCap size={32} />
                        ) : (
                        /* 3. Si no es ninguno de los anteriores, SOLO esto */
                            <UserCheck size={32} />
                        )}
                    </div>
                    
                    <div className='space-y-1'>
                        <h1 className="text-2xl font-bold text-gray-800">
                            ¡Bienvenido{(isAdmin || isTeacher ? ' de nuevo, ' : ' ')}{user?.username || 'Invitado'}!
                        </h1>
                        {(isAdmin || isTeacher) ? (
                            <p className="text-gray-500">
                                Has iniciado sesión como 
                                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                    isAdmin ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                    isTeacher ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                                    'bg-transparent text-zinc-400 border-zinc-200'
                                }`}>
                                    {isAdmin ? 'Administrador' : isTeacher ? 'Profesor' : 'Invitado'}
                                </span>
                            </p> 
                        ) : null}
                    </div>
                </div>

                <hr className="my-4 border-gray-100" />

                <div className="mt-4">
                    <p className="text-gray-700">
                        Actualmente estás visualizando el centro: 
                        <span className="font-bold text-blue-600 ml-1">
                            {selectedCenter?.name || 'Ninguno seleccionado'}
                        </span>
                    </p>
                </div>
                
                {/* Mensaje de ayuda dinámico */}
                <div className={`flex flex-col items-center h-full mt-6 p-4 rounded-lg border-l-4 transition-colors ${
                    isAdmin ? 'bg-rose-50 border-rose-300' : 
                    isTeacher ? 'bg-sky-50 border-sky-300' : 
                    'bg-gray-50 border-gray-300'
                }`}>
                    {isAdmin && (
                        <p className="text-sm text-rose-900 mb-4 font-medium">
                            Tienes acceso total. Puedes gestionar puntos de interés (POIs), ver el historial de auditoría y configurar el sistema.
                        </p>
                    )}
                    {isTeacher && (
                        <p className="text-sm text-sky-900 mb-4 font-medium">
                            Como profesor, puedes gestionar tus clases y ver la información de los puntos de interés.
                        </p>
                    )}
                    {!isAdmin && !isTeacher && (
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                            Puedes explorar el mapa y ver la información de los puntos de interés.
                        </p>
                    )}
                    <UnityViewer />
                </div>
            </div>
        </div>
    );
};