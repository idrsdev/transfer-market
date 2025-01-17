import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/api";

interface User {
  id: string;
  email: string;
  has_completed_setup: boolean;
  team_id: string | null;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasCompletedSetup: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: User | null;
    loading: boolean;
    hasCompletedSetup: boolean;
    initialized: boolean;
  }>({
    user: null,
    loading: true,
    hasCompletedSetup: false,
    initialized: false,
  });

  const updateAuthState = (updates: Partial<typeof authState>) => {
    setAuthState((current) => ({ ...current, ...updates }));
  };

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      updateAuthState({
        loading: false,
        initialized: true,
      });
      return;
    }

    // If we have a token, validate it and get user data
    const validateToken = async () => {
      try {
        const { user } = await auth.getCurrentUser();

        updateAuthState({
          user,
          hasCompletedSetup: user.has_completed_setup,
          loading: false,
          initialized: true,
        });
      } catch (err) {
        console.error("Error validating token:", err);
        localStorage.removeItem("auth_token");
        updateAuthState({
          user: null,
          hasCompletedSetup: false,
          loading: false,
          initialized: true,
        });
      }
    };

    validateToken();
  }, []);

  const signUp = async (email: string, password: string) => {
    // updateAuthState({ loading: true });
    try {
      const { user } = await auth.loginOrSignup(email, password);
      updateAuthState({
        user,
        hasCompletedSetup: user.has_completed_setup,
      });
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    // updateAuthState({ loading: true });
    try {
      const { user } = await auth.loginOrSignup(email, password);
      updateAuthState({
        user,
        hasCompletedSetup: user.has_completed_setup,
      });
    } finally {
      updateAuthState({ loading: false });
    }
  };

  const signOut = () => {
    auth.logout();
    updateAuthState({
      user: null,
      hasCompletedSetup: false,
      loading: false,
    });
  };

  const updateUser = (user: User) => {
    updateAuthState({
      user,
      hasCompletedSetup: user.has_completed_setup,
      loading: false,
    });
  };

  // Don't render anything until we've initialized
  if (!authState.initialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        loading: authState.loading,
        hasCompletedSetup: authState.hasCompletedSetup,
        signUp,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
