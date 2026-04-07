import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    //Vamos a simular un usuario ya autenticado para probar la funcionalidad de el codido.

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { id : 1, name: 'Admin' };
    });

    const [selectedCenter, setSelectedCenter] = useState(() => {
        const savedCenter = localStorage.getItem('selectedCenter');
        return savedCenter ? JSON.parse(savedCenter) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setSelectedCenter(null);
        localStorage.removeItem('user');
        localStorage.removeItem('selectedCenter');
    };

    const selectCenter = (center) => {
        setSelectedCenter(center);
        localStorage.setItem('selectedCenter', JSON.stringify(center));
    };

    return (
        <AuthContext.Provider value={{user, login, logout, selectedCenter, selectCenter}}>
            {children}
        </AuthContext.Provider>
    );

};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
        const ctx = useContext(AuthContext);
        if (!ctx) throw new Error('useAuth deber ser usado dentro de un AuthProvider');
        return ctx;
};