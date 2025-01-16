import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";
import AppRoutes from "@/components/AppRoutes";

function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
