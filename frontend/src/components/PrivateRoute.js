import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        
        // Token süresi dolmuş mu kontrol et
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        // Rol kontrolü
        if (role && decodedToken.role !== role) {
            return <Navigate to="/login" replace />;
        }

        return children;
    } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
