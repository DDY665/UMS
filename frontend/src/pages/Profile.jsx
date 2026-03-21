import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Profile() {
  const [data, setData] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/me");
        setData(res.data.data);
        setNewEmail(res.data.data.email);
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateEmail = async () => {
    setError("");
    setSuccess("");

    if (!newEmail) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await api.patch("/users/me/email", { email: newEmail });
      setSuccess("Email updated successfully.");
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to update email.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="app-panel rounded-2xl p-8 text-sm text-slate-600">Loading profile...</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="app-panel rounded-2xl p-8 text-sm font-medium text-rose-700">
          {error || "Profile is unavailable."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="app-panel rounded-2xl p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Account
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">My Profile</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.role}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Department</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {data.department ? data.department.name : "Not Assigned"}
              </p>
            </div>
          </div>
        </div>

        <div className="app-panel rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-900">Update Email</h3>
          <p className="mt-2 text-sm text-slate-600">Keep your contact email current for notifications.</p>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
          )}
          {success && (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{success}</p>
          )}

          <button
            onClick={updateEmail}
            disabled={saving}
            className="mt-5 rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Updating..." : "Update Email"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
