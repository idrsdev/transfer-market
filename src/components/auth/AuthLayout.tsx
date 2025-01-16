import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "@/components/ui/loader";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return <Loader fullScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Outlet />
      </div>
    </div>
  );
}
