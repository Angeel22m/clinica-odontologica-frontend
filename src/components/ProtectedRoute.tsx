// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  redirectTo?: string;
  allowedRoles?: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  redirectTo = "/login",
  allowedRoles
}) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  // 1. Verificación de Autenticación
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to={redirectTo} replace />;
  }

  // 2. Verificación de Rol (solo si se especificaron roles permitidos)
  if (allowedRoles) {
    if (!userString) {
        // No hay información de usuario para verificar el rol. 
        // Mejor redirigir al login o a una página de error, ya que hay un token pero no hay datos de usuario.
        return <Navigate to={redirectTo} replace />; 
    }
    
    try {
        const user = JSON.parse(userString);
        // Usamos la propiedad 'rol' del objeto de usuario que proporcionaste
        const userRole = user.rol; 
        
        if (!allowedRoles.includes(userRole)) {
            // El rol del usuario NO está en la lista de roles permitidos.
            // Lo enviamos a una ruta segura (como el home o dashboard)
            console.warn(`Acceso denegado: El rol '${userRole}' no puede acceder a esta ruta.`);
            return <Navigate to="/landing" replace />; 
        }
    } catch (e) {
        // Error al parsear el JSON de usuario. Redirigir al login.
        console.error("Error al parsear datos de usuario:", e);
        return <Navigate to={redirectTo} replace />;
    }
  }

  // Autenticado y autorizado
  return element;
};

export default ProtectedRoute;