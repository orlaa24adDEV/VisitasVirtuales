import { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({children}) => {
    //Vamos a simular un usuario ya autenticado para probar la funcionalidad del código.

    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('token') || null;
    });

    const [selectedCenter, setSelectedCenter] = useState(() => {
        const savedCenter = sessionStorage.getItem('selectedCenter');
        return savedCenter ? JSON.parse(savedCenter) : null;
    });

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', userToken);
    };

    const register = async (email, username, password) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el registro');
            }

            const data = await response.json();
            
            // Guardar el token de acceso
            setToken(data.accessToken);
            sessionStorage.setItem('token', data.accessToken);
            
            // Obtener perfil del usuario
            const profileResponse = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${data.accessToken}`,
                },
            });

            if (profileResponse.ok) {
                const userProfile = await profileResponse.json();
                setUser(userProfile);
                sessionStorage.setItem('user', JSON.stringify(userProfile));
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setSelectedCenter(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('selectedCenter');
    };

    const [centers, setCenters] = useState([]);

    const selectCenter = (center) => {
        setSelectedCenter(center);
        sessionStorage.setItem('selectedCenter', JSON.stringify(center));
    };

    const isAdmin = user?.role === 'admin';
    const isTeacher = isAdmin || user?.role === 'teacher';

    return (
        <AuthContext.Provider value={{user, login, register, logout, selectedCenter, selectCenter, centers, setCenters, isAdmin, isTeacher}}>
            {children}
        </AuthContext.Provider>
    );
};