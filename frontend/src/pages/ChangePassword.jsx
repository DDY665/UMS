import { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async () => {
    setError("");

    if (!oldPassword || !newPassword) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      await api.patch("/users/me/password", {
        oldPassword,
        newPassword,
      });

      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to change password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="app-panel fade-in w-full max-w-xl rounded-2xl p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Security Setup
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Change Password</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use your temporary password once, then set a secure new password.
          </p>

          <input
            type="password"
            placeholder="Temporary Password"
            className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {error && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            onClick={handleChange}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
