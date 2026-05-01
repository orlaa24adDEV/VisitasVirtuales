import { useCenterQuery } from '@/hooks/useCenterQuery.js';
import { MapPin } from 'lucide-react'; // Iconos para darle estilo
import UnityViewer from '../components/UnityViewer';
import { useCenter } from '../hooks/useCenter';

export default function Viewer() {
    const { selectedCenter } = useCenter();

    // Si el context no contiene un centro, utilizar el query param "center" de la URL, 
    // proporcionado por la página de selección de centro. Esto es un fallback y además
    // permite compartir URLs directas a centros específicos.
    useCenterQuery();

    return (
        <div className={`p-8 mx-auto max-w-4xl`}>
            <div className='flex flex-col gap-px w-full mb-2'>
                <p className="text-sm flex items-center gap-1 font-medium text-blue-600">
                <MapPin className='w-4 h-4' /><span className="">{selectedCenter.name}</span>
                </p>
                <h2 className='text-xl font-semibold text-slate-800'>
                Visita 360°
                </h2>
            </div>
            <div className="p-6 w-full flex justify-center bg-white border rounded-xl shadow-xl/6 border-slate-100">
                {/* Solo montamos Unity cuando selectedCenter ya tiene valor */}
                {selectedCenter ? (
                    <UnityViewer />
                ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400">
                        <p className="text-sm italic">Cargando centro...</p>
                    </div>
                )}
            </div>
        </div>
    );
};