import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const PrivateRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem('token');

  if (!token || token.length < 10) {
    return <Navigate to="/register" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // Если роли не указаны, пропускаем всех авторизованных
    if (roles.length === 0 || roles.includes(userRole)) {
      return children;
    }

    // Роль не подходит
    return <Navigate to="/" replace />;
  } catch (err) {
    console.error("Ошибка при декодировании токена:", err);
    return <Navigate to="/register" replace />;
  }
};

export default PrivateRoute;
