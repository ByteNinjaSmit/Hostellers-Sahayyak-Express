import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth.jsx";

export const AdminLayout = () => {
  const { user, isAdmin, isLoading,isLoggedIn } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1>Loading ...........</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  // Redirect non-admin users to home, and "/admin" to "/admin/dashboard"
  if (!isAdmin && !user) {
    return <Navigate to="/" />;
  } else if (location.pathname === '/admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  return <Outlet />;
};