import { createContext, useContext, useEffect, useState } from "react";
import { teams } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface Player {
  id: string;
  name: string;
  team_id: string;
  position: string;
  base_price: number;
  is_listed: boolean;
  listing_price: number | null;
}

interface Team {
  id: string;
  name: string;
  created_at: Date;
}

interface TeamContextType {
  team: Team | null;
  players: Record<string, Player[]>;
  loading: boolean;
  error: Error | null;
  isOwner: boolean;
  refreshTeam: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamState, setTeamState] = useState<{
    team: Team | null;
    players: Record<string, Player[]>;
    loading: boolean;
    error: Error | null;
  }>({
    team: null,
    players: {},
    loading: true,
    error: null,
  });

  const { user } = useAuth();

  const loadTeam = async () => {
    if (!user?.team_id) {
      setTeamState((current) => ({ ...current, loading: false }));
      return;
    }

    try {
      setTeamState((current) => ({ ...current, loading: true }));
      const playersData = await teams.getMyPlayers();
      setTeamState((current) => ({
        ...current,
        players: playersData,
        loading: false,
        error: null,
      }));
    } catch (e) {
      setTeamState((current) => ({
        ...current,
        error: e instanceof Error ? e : new Error("Failed to load team"),
        loading: false,
      }));
    }
  };

  useEffect(() => {
    loadTeam();
  }, [user?.team_id]);

  return (
    <TeamContext.Provider
      value={{
        ...teamState,
        isOwner: user?.team_id === teamState.team?.id,
        refreshTeam: loadTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
