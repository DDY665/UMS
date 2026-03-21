import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboard from "./pages/Onboard";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Team from "./pages/Team";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./auth/ProtectedRoute";
import OnboardingGuard from "./auth/OnboardingGuard";
import RoleRoute from "./auth/RoleRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboard" element={<Onboard />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Change password must be accessible before onboarding complete */}
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Routes that require onboarding complete */}
          <Route element={<OnboardingGuard />}>
            <Route path="/" element={<Profile />} />

            <Route element={<RoleRoute roles={["manager", "supervisor"]} />}>
              <Route path="/team" element={<Team />} />
            </Route>

            <Route element={<RoleRoute roles={["admin"]} />}>
              <Route path="/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>

        {/* ✅ Catch-all route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
