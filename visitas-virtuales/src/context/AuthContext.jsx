import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    //Vamos a simular un usuario ya autenticado para probar la funcionalidad de el codido.

    const [user, setUser] = useState({id: 1, name: 'Admin'});
    const [selectdCenter, setSelectedCenter] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setSelectedCenter(null);
    };

    const selectCenter = (center) => {
        setSelectedCenter(center);
    };

    return (
        <AuthContext.Provider value={{user, login, logout, selectdCenter, selectCenter}}>
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