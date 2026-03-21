import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import CreateEmployeeModal from "../components/CreateEmployeeModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data || []);
      setError("");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load users.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    await api.patch(`/users/${id}/block`);
    await fetchUsers();
  };

  const unblockUser = async (id) => {
    await api.patch(`/users/${id}/unblock`);
    await fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesQuery = user.email.toLowerCase().includes(query.toLowerCase());

    if (statusFilter === "active") return matchesQuery && user.is_active;
    if (statusFilter === "blocked") return matchesQuery && !user.is_active;
    return matchesQuery;
  });

  const activeCount = users.filter((user) => user.is_active).length;
  const blockedCount = users.length - activeCount;

  if (loading) {
    return (
      <Layout>
        <div className="app-panel rounded-2xl p-8 text-sm text-slate-600">Loading users...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{users.length}</p>
          </div>
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">{activeCount}</p>
          </div>
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Blocked</p>
            <p className="mt-2 text-3xl font-semibold text-rose-700">{blockedCount}</p>
          </div>
        </div>

        <div className="app-panel overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">All Users</h2>
              <p className="mt-1 text-sm text-slate-600">Manage user status and onboarding access.</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              + Create Employee
            </button>
          </div>

          <div className="grid gap-3 border-b border-slate-200/70 px-6 py-4 sm:grid-cols-2">
            <input
              placeholder="Search by email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="blocked">Blocked only</option>
            </select>
          </div>

          {error ? (
            <p className="px-6 py-8 text-sm font-medium text-rose-700">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-600">No users found for this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-left text-sm text-slate-700">
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200/70">
                      <td className="px-6 py-3 text-slate-800">{user.email}</td>
                      <td className="px-6 py-3 text-slate-700">{user.role}</td>
                      <td className="px-6 py-3">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            user.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          ].join(" ")}
                        >
                          {user.is_active ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {user.is_active ? (
                          <button
                            onClick={() => blockUser(user.id)}
                            className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockUser(user.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateEmployeeModal
          onClose={async () => {
            setShowModal(false);
            await fetchUsers();
          }}
        />
      )}
    </Layout>
  );
}
