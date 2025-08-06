import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in but unauthorized role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Authorized
  return <Outlet />;
};

export default PrivateRoute;
