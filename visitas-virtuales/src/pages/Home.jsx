import React from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import { UserCheck, ShieldCheck } from 'lucide-react'; // Iconos para darle estilo
import UnityViewer from '../components/UnityViewer';

const Home = () => {
    const { user, isAdmin, selectedCenter } = useAuth();

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    {/* Icono dinámico según el rol */}
                    <div className={`p-3 rounded-full ${isAdmin ? 'bg-gray-200 text-red-600' : 'bg-gray-200 text-blue-600'}`}>
                        {isAdmin ? <ShieldCheck size={32} /> : <UserCheck size={32} />}
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            ¡Bienvenido de nuevo, {user?.username}!
                        </h1>
                        <p className="text-gray-500">
                            Has iniciado sesión como: 
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                isAdmin ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                                {isAdmin ? 'Administrador' : 'Estudiante'}
                            </span>
                        </p>
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
                <div className="h-full mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    {isAdmin ? (
                        <p className="text-sm text-black ">
                            Tienes acceso total. Puedes gestionar puntos de interés (POIs), ver el historial de auditoría y configurar el sistema.
                        </p>
                    ) : (
                        <p className="text-sm text-black ">
                            Puedes explorar el mapa y ver la información de los puntos de interés.
                        </p>
                    )}
                    <UnityViewer />
                </div>
            </div>
        </div>
    );
};

export default Home;