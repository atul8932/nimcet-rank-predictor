import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authData = sessionStorage.getItem("auth");

  if (!authData) {
    return <Navigate to="/" replace />;
  }

  try {
    const { phone, expiry } = JSON.parse(authData);
    if (!phone || new Date().getTime() > expiry) {
      sessionStorage.removeItem("auth");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    sessionStorage.removeItem("auth");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
