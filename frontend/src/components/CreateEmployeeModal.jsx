import { useState } from "react";
import api from "../api/axios";

export default function CreateEmployeeModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [departmentId, setDepartmentId] = useState(1);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/users/create", {
        email,
        role,
        departmentId,
      });

      if (res.data.success) {
        setCreated(true);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create employee.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
      <div className="app-panel w-full max-w-md rounded-2xl p-7">
        {!created ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-900">Create Employee</h2>
            <p className="mt-1 text-sm text-slate-600">Provision a new account and send onboarding credentials.</p>

            <input
              placeholder="Email"
              className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="supervisor">Supervisor</option>
            </select>

            <select
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
            >
              <option value={1}>Engineering</option>
              <option value={2}>HR</option>
              <option value={3}>Finance</option>
              <option value={4}>Marketing</option>
            </select>

            {error && (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-emerald-700">
              Employee Created
            </h2>

            <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-800">
              Employee credentials have been sent to the user via email.
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
