import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

/** Hook encargado de sincronizar el centro seleccionado en el context con el query param "center" de la URL. */
export const useCenterQuery = () => {
    const { selectedCenter, setSelectedCenter, centers } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay centro seleccionado en el context, intentar cargarlo desde el query param "center"
        if (!selectedCenter) {
            const centerIdFromUrl = searchParams.get('center');
            if (centerIdFromUrl) {
                const match = centers.find((c) => c.id.toString() === centerIdFromUrl);
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
        }
    }, [selectedCenter, searchParams, centers]);

    useEffect(() => {
        if (selectedCenter) {
            setSearchParams({ center: selectedCenter.id });
        }
    }, [selectedCenter]);
}