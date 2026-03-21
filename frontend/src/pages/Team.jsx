import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/team");
        setTeam(res.data.data || []);
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load team data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const managers = team.filter((member) => member.role === "manager").length;
  const supervisors = team.filter((member) => member.role === "supervisor").length;

  if (loading) {
    return (
      <Layout>
        <div className="app-panel rounded-2xl p-8 text-sm text-slate-600">Loading team...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Members</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{team.length}</p>
          </div>
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Managers</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{managers}</p>
          </div>
          <div className="app-panel rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Supervisors</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{supervisors}</p>
          </div>
        </div>

        <div className="app-panel overflow-hidden rounded-2xl">
          <div className="border-b border-slate-200/80 px-6 py-4">
            <h2 className="text-2xl font-semibold text-slate-900">My Team</h2>
            <p className="mt-1 text-sm text-slate-600">Monitor assigned team members and their roles.</p>
          </div>

          {error ? (
            <p className="px-6 py-8 text-sm font-medium text-rose-700">{error}</p>
          ) : team.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-600">No team members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-105 border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-left text-sm text-slate-700">
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.id} className="border-t border-slate-200/70">
                      <td className="px-6 py-3 text-slate-800">{member.email}</td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
