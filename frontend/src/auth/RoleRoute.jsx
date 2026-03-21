import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RoleRoute({ roles }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let decoded;

  try {
    decoded = jwtDecode(token);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  if (!roles.includes(decoded.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
