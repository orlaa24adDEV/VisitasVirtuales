// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
    const { user, isAdmin } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/home" />; // Si no es admin, lo mandamos a home

    return children;
};