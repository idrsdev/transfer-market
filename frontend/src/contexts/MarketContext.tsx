import { createContext, useContext, useState } from "react";
import { players } from "@/lib/api";
import { Position } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

interface Player {
  id: string;
  name: string;
  team_id: string;
  position: string;
  base_price: number;
  is_listed: boolean;
  listing_price: number | null;
}

interface MarketFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  team?: string;
  min_price?: number;
  max_price?: number;
  position?: Position;
  is_listed?: boolean;
}

interface MarketContextType {
  players: Player[];
  totalPages: number;
  loading: boolean;
  error: Error | null;
  filters: MarketFilters;
  setFilters: (filters: MarketFilters) => void;
  buyPlayer: (playerId: string) => void;
  listPlayer: (playerId: string, price: number) => void;
  unlistPlayer: (playerId: string) => void;
  refreshMarket: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuth();

  const [marketState, setMarketState] = useState<{
    players: Player[];
    totalPages: number;
    loading: boolean;
    error: Error | null;
    filters: MarketFilters;
  }>({
    players: [],
    totalPages: 0,
    loading: true,
    error: null,
    filters: {
      page: 1,
      pageSize: 8,
      is_listed: true,
    },
  });

  const loadMarket = async (filterOverrides?: MarketFilters) => {
    try {
      setMarketState((current) => ({ ...current, loading: true }));
      const filtersToUse = filterOverrides || marketState.filters;
      const data = await players.getPlayers(filtersToUse);

      setMarketState((current) => ({
        ...current,
        players: data.players,
        totalPages: data.totalPages,
        error: null,
        loading: false,
      }));
    } catch (e) {
      setMarketState((current) => ({
        ...current,
        error: e instanceof Error ? e : new Error("Failed to load market"),
        loading: false,
      }));
    }
  };

  const setFilters = (newFilters: MarketFilters) => {
    const updatedFilters = { ...marketState.filters, ...newFilters };
    setMarketState((current) => ({
      ...current,
      filters: updatedFilters,
    }));
    loadMarket(updatedFilters);
  };

  const buyPlayer = async (playerId: string) => {
    try {
      const result = await players.buyPlayer(playerId);
      await loadMarket(); // Refresh the market after purchase

      if (user) {
        updateUser({ ...user, balance: result.new_balance });
      }
      return result;
    } catch (e) {
      throw e instanceof Error ? e : new Error("Failed to buy player");
    }
  };

  const listPlayer = async (playerId: string, price: number) => {
    try {
      const result = await players.listPlayer(playerId, price);
      await loadMarket(); // Refresh the market after listing
      return result;
    } catch (e) {
      throw e instanceof Error ? e : new Error("Failed to list player");
    }
  };

  const unlistPlayer = async (playerId: string) => {
    try {
      const result = await players.unlistPlayer(playerId);
      await loadMarket(); // Refresh the market after unlisting
      return result;
    } catch (e) {
      throw e instanceof Error ? e : new Error("Failed to unlist player");
    }
  };

  return (
    <MarketContext.Provider
      value={{
        ...marketState,
        setFilters,
        buyPlayer,
        listPlayer,
        unlistPlayer,
        refreshMarket: loadMarket,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
}
