// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';

export const AdminRoute = ({ children }) => {
    const { authState, isAdmin, isTeacher } = useAuth();
    const { user } = authState;

    if (!user) return <Navigate to="/login" />;
    if ( isAdmin || isTeacher ) return children;

    return <Navigate to="/home" />;

};