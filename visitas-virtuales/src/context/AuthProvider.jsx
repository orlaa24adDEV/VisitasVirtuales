import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { setAccessToken, removeAccessToken, isTokenExpired, getAccessToken } from '../helpers/auth.js';
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js';

export const AuthProvider = ({ children }) => {

    // Estado de carga inicial
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    /* ============================= */
    /* ==== Gestión de usuarios ==== */
    /* ============================= */

    const [user, setUser] = useState(null);
    const fetchProfile = async (providedToken = null) => {
        setIsInitialLoading(true);
        let token = providedToken || await getValidAccessToken();
        
        if (!token) {
            setUser(null);
            setIsInitialLoading(false);
            return;
        }
        try {
            const res = await fetchWithTimeout('/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            }, 5000);
            if (!res.ok) throw new Error('Session invalid');
            const data = await res.json();
            setUser(data.profile);
        } catch (err) {
            console.error('Profile fetch failed:', err);
            removeAccessToken();
            setUser(null);
        } finally {
            setIsInitialLoading(false);
        }
    };

    /* ============================ */
    /* ==== Gestión de centros ==== */
    /* ============================ */

    const [allCenters, setAllCenters] = useState(() => {
        const stored = localStorage.getItem('allCenters');
        return stored ? JSON.parse(stored) : [];
    });
    const [selectedCenter, setSelectedCenter] = useState(() => {
        const stored = localStorage.getItem('selectedCenter');
        return stored ? JSON.parse(stored) : null;
    });
    const selectCenter = (center) => {
        setSelectedCenter(center);
        localStorage.setItem('selectedCenter', JSON.stringify(center));
    };

    const loadCenters = (allCenters) => {
        setAllCenters(allCenters);
        localStorage.setItem('allCenters', JSON.stringify(allCenters));
    };

    // Llamada a la API para cargar centros, con manejo de token válido
    const fetchCenters = async (providedToken = null) => {
        setIsCentersLoading(true);
        setCentersError(null);
        let token = providedToken || await getValidAccessToken();

        if (!token) {
            setIsCentersLoading(false);
            return;
        }
            
        try {
            const response = await fetchWithTimeout('/api/centers', {
                headers: { Authorization: `Bearer ${token}` }
            }, 5000);
            const data = await response.json();
            if (!response.ok) throw new Error('Error al cargar los centros: ' + (data.message));
            setAllCenters(data.centers);
            localStorage.setItem('allCenters', JSON.stringify(data.centers));
        } catch (err) {
            setCentersError(err.message || 'Error desconocido');
        } finally {
            setIsCentersLoading(false);
        }
    };

    const [isCentersLoading, setIsCentersLoading] = useState(true);
    const [centersError, setCentersError] = useState(null);

    /* =========================================== */
    /* ==== Autenticación y gestión de tokens ==== */
    /* =========================================== */

    const refreshTokens = async () => {
        try {
            const response = await fetch('/api/users/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Enviar refreshToken (desde cookie HttpOnly)
            });

            if (!response.ok) throw new Error('No se pudieron renovar los tokens');
            const data = await response.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
        } catch (err) {
            console.error('Error al renovar tokens:', err);
            setUser(null);
            return null;
        }
    };

    // Helper para obtener un token válido, renovándolo si es necesario
    const getValidAccessToken = async () => {
        const token = getAccessToken();
        if (!token) return null;

        if (isTokenExpired(token)) {
            const newToken = await refreshTokens();
            if (!newToken) {
                removeAccessToken();
                return null;
            }
            return newToken;
        }

        return token;
    };

    // Cargar perfil y centros al montar el componente
    useEffect(() => {
        const load = async () => {
            await fetchProfile();
            await fetchCenters();
        };
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (accessToken) => {
        setAccessToken(accessToken);
        await fetchProfile(accessToken);
        await fetchCenters(accessToken);
    };

    const logout = async () => {
        const token = getAccessToken();
        setUser(null);
        setSelectedCenter(null);
        removeAccessToken();

        try {
            await fetch('/api/users/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };



    const isAdmin = user?.role === 'admin';
    const isTeacher = isAdmin || user?.role === 'teacher';

    return (
        <AuthContext.Provider
            value={{
                user,
                isInitialLoading,
                isCentersLoading,
                centersError,
                login,
                logout,
                selectedCenter,
                setSelectedCenter,
                selectCenter,
                allCenters,
                setAllCenters,
                setAccessToken,
                isAdmin,
                isTeacher,
                loadCenters
            }}
        >
            {!isInitialLoading ? children : <div className="spinner">Cargando...</div>}
        </AuthContext.Provider>
    );
};