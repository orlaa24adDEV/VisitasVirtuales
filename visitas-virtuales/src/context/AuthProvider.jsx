import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { setAccessToken, removeAccessToken, getAccessToken } from '../helpers/auth.js';
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [allCenters, setAllCenters] = useState(() => {
        const stored = localStorage.getItem('allCenters');
        return stored ? JSON.parse(stored) : [];
    });
    const [selectedCenter, setSelectedCenter] = useState(() => {
        const stored = localStorage.getItem('selectedCenter');
        return stored ? JSON.parse(stored) : null;
    });
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isCentersLoading, setIsCentersLoading] = useState(true);
    const [centersError, setCentersError] = useState(null);

    const fetchProfile = async () => {
        setIsInitialLoading(true);
        const token = getAccessToken();
        if (!token) {
            setUser(null);
            setIsInitialLoading(false);
            return;
        }
        try {
            const res = await fetch('/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const fetchCenters = async () => {
        setIsCentersLoading(true);
        setCentersError(null);
        try {
            const response = await fetchWithTimeout('/api/centers', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
            }, 5000);
            const data = await response.json();
            if (!response.ok) throw new Error('Error al cargar los centros: ' + (data.message));
            setAllCenters(data.centers);
        } catch (err) {
            setCentersError(err.message || 'Error desconocido');
        } finally {
            setIsCentersLoading(false);
        }
    };

    // Cargar perfil y centros al montar el componente
    useEffect(() => {
        fetchProfile();
        fetchCenters();
    }, []);

    // Al iniciar sesión, guardar el token y cargar el perfil del usuario
    const login = async (accessToken) => {
        setAccessToken(accessToken);
        fetchProfile();
    };

    // Al cerrar sesión, limpiar usuario, centro, y tokens de acceso y refresco
    const logout = async () => {
        setUser(null);
        setSelectedCenter(null);
        // Pedir al backend que envie instrucciones al navegador para eliminar
        // el refresh token (cookie httpOnly)
        try {
            await fetch('/api/users/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`
                }
            });
        } catch (err) {
            console.error('Logout failed:', err);
        }
        removeAccessToken();
    };

    const selectCenter = (center) => {
        setSelectedCenter(center);
        localStorage.setItem('selectedCenter', JSON.stringify(center));
    };

    const loadCenters = (allCenters) => {
        setAllCenters(allCenters);
        localStorage.setItem('allCenters', JSON.stringify(allCenters));
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
