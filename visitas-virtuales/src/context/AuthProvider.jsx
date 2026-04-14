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
        <AuthContext.Provider value={{user, login, logout, selectedCenter, selectCenter, centers, setCenters, isAdmin, isTeacher}}>
            {children}
        </AuthContext.Provider>
    );
};