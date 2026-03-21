import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Onboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);
    navigate("/change-password", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="app-panel fade-in rounded-2xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Employee Onboarding
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Preparing your workspace...</h2>
        <p className="mt-2 text-sm text-slate-600">
          Verifying your secure token and redirecting you to set a new password.
        </p>
      </div>
    </div>
  );
}
