import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to login. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="app-panel fade-in grid w-full max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-2">
        <section className="relative hidden bg-slate-900 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.22),transparent_36%)]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Run your workforce operations with clarity.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-slate-200">
              Access role-specific dashboards for onboarding, team visibility, and account administration.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <h2 className="text-3xl font-semibold text-slate-900">Login</h2>
          <p className="mt-2 text-sm text-slate-600">Use your work account credentials to continue.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Do not have an account?{" "}
            <Link to="/signup" className="font-semibold text-cyan-700 hover:text-cyan-800">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
