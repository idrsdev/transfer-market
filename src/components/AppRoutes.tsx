import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import TeamCreationFlow from "@/components/auth/TeamCreationFlow";
import Home from "@/components/home";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { Loader } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TeamPage from "@/components/team/TeamPage";

export default function AppRoutes() {
  const { loading, user, hasCompletedSetup } = useAuth();

  // Only show initial loading when we have no auth information
  if (loading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Toaster />

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<SignupForm />} />
        </Route>

        {/* Separate route for team creation */}
        <Route
          path="/create-team"
          element={
            user && !hasCompletedSetup ? (
              <TeamCreationFlow />
            ) : (
              <Navigate to={user ? "/" : "/auth/login"} replace />
            )
          }
        />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<TeamPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
