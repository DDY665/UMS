import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);

  const roleLabel = user?.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : "User";

  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <div className="app-panel flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workforce Dashboard
          </p>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Employee Management System
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 sm:inline">
            {roleLabel}
          </span>
          <button
            onClick={logout}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
