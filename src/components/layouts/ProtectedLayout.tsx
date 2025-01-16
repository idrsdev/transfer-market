import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "@/components/ui/loader";

export default function ProtectedLayout() {
  const { user, loading, hasCompletedSetup } = useAuth();

  if (loading && !user) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!hasCompletedSetup) {
    return <Navigate to="/create-team" replace />;
  }

  return <Outlet />;
}
