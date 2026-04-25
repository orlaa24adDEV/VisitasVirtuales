import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';


// Mapeo de ID de centro (BD) al índice de escena en el build de Unity.IMPORTANTE: Debe coincidir exactamente con el orden de las escenas
// Escena 0: Bootstrap (arranque), Escena 1: Madrid, Escena 2: Córdoba las que tenemos
// Los centros sin escena propia apuntan a la escena 1 como fallback por ahora
const ESCENAS_POR_CENTRO = {
    1: 1, // Instituto Madrid → Escena 1
    2: 1, // Instituto Barcelona → fallback Madrid (sin escena propia aún)
    3: 1, // Instituto Sevilla → fallback Madrid (sin escena propia aún)
    4: 1, // Instituto Valencia → fallback Madrid (sin escena propia aún)
    5: 2, // Instituto Córdoba → Escena 2
};

/** Hook encargado de sincronizar el centro seleccionado en el context con el query param "center" de la URL. */
export const useCenterQuery = () => {
    const { centerState } = useAuth();
    const { selectedCenter, allCenters, saveSelectedCenter } = centerState;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay centro seleccionado en el context, intentar cargarlo desde el query param "center"
        if (!selectedCenter) {
            const centerIdFromUrl = searchParams.get('center');
            if (centerIdFromUrl) {
                const match = allCenters.find((c) => c.id.toString() === centerIdFromUrl);
                if (match) {
                    saveSelectedCenter(match);
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
            //Busca en la tabla cual escena le corresponde al centro seleccionado. 
            // Si no esta usa 0 como valor por defecto
            const sceneId = ESCENAS_POR_CENTRO[selectedCenter.id] ?? 0;

            //ir actualizando la URL con centro y la escena
            setSearchParams({ center: selectedCenter.id, scene: sceneId });
        }
    }, [selectedCenter, searchParams, allCenters, setSearchParams, navigate, saveSelectedCenter]);
}