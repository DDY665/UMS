import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OnboardingGuard() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let decoded;

  try {
    decoded = jwtDecode(token);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  if (decoded.must_change_password) {
    return <Navigate to="/change-password" />;
  }

  return <Outlet />;
}
