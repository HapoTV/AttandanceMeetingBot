import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, render the children
  // Otherwise, redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
