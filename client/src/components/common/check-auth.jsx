import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Check localStorage for persistent authentication state
  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Fallback to persisted data if props are not available
  const authenticated = isAuthenticated || !!token;
  const currentUser = user || storedUser;

  // Handle "/" route
  if (location.pathname === "/") {
    if (!authenticated) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    } else {
      if (currentUser?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/shop/home" replace />;
      }
    }
  }

  // Redirect unauthenticated users from protected routes
  if (
    !authenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Prevent authenticated users from accessing login/register pages
  if (
    authenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  // Prevent non-admin users from accessing admin pages
  if (authenticated && currentUser?.role !== "admin" && location.pathname.includes("admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Prevent admin users from accessing shop pages
  if (authenticated && currentUser?.role === "admin" && location.pathname.includes("shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
