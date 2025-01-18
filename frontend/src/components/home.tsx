import { useEffect } from "react";
import TransferHeader from "./transfer/TransferHeader";
import SearchFilters from "./transfer/SearchFilters";
import PlayerGrid from "./transfer/PlayerGrid";
import { useMarket } from "@/contexts/MarketContext";
import { useTeam } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

export default function Home() {
  const { user } = useAuth();
  const {
    players,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    buyPlayer,
    listPlayer,
    unlistPlayer,
    refreshMarket,
  } = useMarket();

  const { refreshTeam } = useTeam();

  // Refresh market on mount
  useEffect(() => {
    refreshMarket();
  }, []);

  const handleBuyPlayer = async (playerId: string) => {
    try {
      await buyPlayer(playerId);
      await refreshTeam(); // Refresh team data after purchase
    } catch (error) {
      console.error("Failed to buy player:", error);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TransferHeader budget={user?.balance || 0} />

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => setFilters({})}
      />

      <PlayerGrid
        players={players}
        currentPage={filters.page || 1}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onBuyPlayer={handleBuyPlayer}
        onListPlayer={listPlayer}
        onUnlistPlayer={unlistPlayer}
      />
    </div>
  );
}
