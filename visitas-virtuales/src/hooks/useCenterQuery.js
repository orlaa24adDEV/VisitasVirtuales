import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

// Mapeo de ID de centro a ID de escena de Unity (índice desde 0)
// TODO: confirmar el índice exacto de cada escena
//asignamos los centros con ID especificos
const ESCENAS_POR_CENTRO = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
};

/** Hook encargado de sincronizar el centro seleccionado en el context con el query param "center" de la URL. */
export const useCenterQuery = () => {
    const { centerState } = useAuth();
    const { selectedCenter, allCenters, setSelectedCenter } = centerState;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay centro seleccionado en el context, intentar cargarlo desde el query param "center"
        if (!selectedCenter) {
            const centerIdFromUrl = searchParams.get('center');
            if (centerIdFromUrl) {
                const match = allCenters.find((c) => c.id.toString() === centerIdFromUrl);
                if (match) {
                    setSelectedCenter(match);
                } else {
                    // Si el ID del centro en la URL no es válido, limpiar el query param y redirigir a selección de centro
                    setSearchParams({});
                    navigate('/select-center');
                }
            } else {
                // Si no hay centro seleccionado ni en el context ni en la URL, redirigir a selección de centro
                navigate('/select-center');
            }
        } else {
            //obtener el ID de escena correspondiente al centro seleccionado
            const sceneId = ESCENAS_POR_CENTRO[selectedCenter.id] ?? 0;

            //ir actualizando la URL con centro y la escena
            setSearchParams({ center: selectedCenter.id, scene: sceneId });
        }
    }, [selectedCenter, searchParams, allCenters, setSearchParams, navigate, setSelectedCenter]);
}