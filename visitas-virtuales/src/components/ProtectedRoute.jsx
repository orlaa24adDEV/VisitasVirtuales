// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
    const { user, isAdmin, isTeacher } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if ( isAdmin || isTeacher ) return children;

    return <Navigate to="/home" />;

};