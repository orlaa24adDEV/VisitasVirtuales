import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { setAccessToken, removeAccessToken, getAccessToken } from '../helpers/auth.js';

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [centers, setCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchProfile = async () => {
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
            console.error("Profile fetch failed:", err);
            removeAccessToken();
            setUser(null);
        } finally {
            setIsInitialLoading(false);
        }
    };

    // Cargar perfil en el contexto al montar el proveedor
    useEffect(() => {
        fetchProfile();
    }, []);
    
    // Al iniciar sesión, guardar el token y cargar el perfil del usuario
    const login =  async (accessToken) => {
        setAccessToken(accessToken);
        fetchProfile();
    }

    // Al cerrar sesión, limpiar usuario, centro, y tokens de acceso y refresco
    const logout = async () => {
        setUser(null);
        setSelectedCenter(null);
        // Pedir al backend que envie instrucciones al navegador para eliminar 
        // el refresh token (cookie httpOnly)
        try {
            await fetch('/api/users/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                headers: { Authorization: `Bearer ${getAccessToken()}` }
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }
        removeAccessToken();
    };

    const selectCenter = (center) => {
        setSelectedCenter(center);
        sessionStorage.setItem('selectedCenter', JSON.stringify(center));
    };

    const isAdmin = user?.role === 'admin';
    const isTeacher = isAdmin || user?.role === 'teacher';

    return (
        <AuthContext.Provider value={{user, isInitialLoading, login, logout, selectedCenter, selectCenter, centers, setAccessToken, setCenters, setAccessToken, isAdmin, isTeacher}}>
            {!isInitialLoading ? children : <div className="spinner">Cargando...</div>}
        </AuthContext.Provider>
    );
};