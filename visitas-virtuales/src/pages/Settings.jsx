import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UploadImageForm from '@/components/UploadImageForm';
import { LayoutGrid } from 'lucide-react';

export default function Settings() {
    //////const { centerState } = useAuth();

    const { authState, isAdmin } = useAuth();
    const { user } = authState;
    const { centerState } = useAuth();
    const { allCenters } = centerState;
    const [selectedId, setSelectedId] = useState('');


    //console.log('Datos del usuario en Perfil.jsx:', user);
    //const isAdmin = user?.role === 'admin';

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                    <p className="text-white text-sm mt-1 italic">{user?.email}</p>
                </div>

                <div className="p-8">
                    {isAdmin ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-blue-600 mb-2 justify-center">
                                <LayoutGrid className="w-5 h-5" />
                                <h2 className="font-bold uppercase tracking-wider text-sm">Gestión de Centros</h2>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-sm text-slate-600 mb-4 font-medium">Selecciona un centro para cambiar su foto de portada:</p>
                                
                                <select 
                                    className=" cursor-pointer w-full p-3 rounded-xl border-slate-200 bg-white mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                >
                                    <option value="">-- Elige un centro educativo --</option>
                                    {allCenters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>

                                {selectedId && (
                                    <UploadImageForm 
                                        centerId={selectedId} 
                                        currentImage={allCenters.find(c => c.id == selectedId)?.imageUrl} 
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500 italic">Panel de administración no disponible para tu cuenta.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}