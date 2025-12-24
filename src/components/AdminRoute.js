import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token || token.length < 10) {
    return <Navigate to="/register" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role; // fallback

    if (role !== 'Admin') {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error("Ошибка декодирования токена", err);
    return <Navigate to="/register" replace />;
  }
};

export default AdminRoute;
