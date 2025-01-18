import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";
import AppRoutes from "@/components/AppRoutes";
import { MarketProvider } from "@/contexts/MarketContext";
import { TeamProvider } from "@/contexts/TeamContext";

function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <AuthProvider>
        <TeamProvider>
          <MarketProvider>
            <AppRoutes />
          </MarketProvider>
        </TeamProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
