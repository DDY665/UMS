import { NavLink, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let role;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  const linkClass = ({ isActive }) =>
    [
      "block rounded-xl px-4 py-3 text-sm font-medium transition",
      isActive
        ? "bg-white/20 text-white shadow-sm"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    ].join(" ");

  const roleLabel = role ? `${role[0].toUpperCase()}${role.slice(1)}` : "User";

  return (
    <aside className="hidden w-72 flex-col justify-between border-r border-slate-900/10 bg-linear-to-b from-slate-900 via-slate-800 to-cyan-900 px-6 py-8 text-white lg:flex">
      <div>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">
            UMS Control
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Dashboard</h2>
          <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            {roleLabel}
          </p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" className={linkClass}>
            My Profile
          </NavLink>

          {(role === "manager" || role === "supervisor") && (
            <NavLink to="/team" className={linkClass}>
              Team Overview
            </NavLink>
          )}

          {role === "admin" && (
            <NavLink to="/users" className={linkClass}>
              User Administration
            </NavLink>
          )}
        </nav>
      </div>

      <p className="text-xs leading-5 text-cyan-100/70">
        Keep user access, onboarding, and team roles aligned from one place.
      </p>
    </aside>
  );
}
