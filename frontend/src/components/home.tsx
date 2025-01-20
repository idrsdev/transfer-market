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

  useEffect(() => {
    refreshMarket();
  }, []);

  const handleBuyPlayer = async (playerId: string) => {
    try {
      await buyPlayer(playerId);
      await refreshTeam();
    } catch (error) {
      console.error("Failed to buy player:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <TransferHeader budget={user?.balance || 0} />

        <div className="my-6">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>

        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
              <Loader />
            </div>
          ) : error ? (
            <div className="flex min-h-[400px] items-center justify-center text-red-500 bg-gray-50">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">Error occurred</p>
                <p className="text-sm opacity-80">{error.message}</p>
              </div>
            </div>
          ) : (
            <PlayerGrid
              players={players}
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
              onBuyPlayer={handleBuyPlayer}
              onListPlayer={listPlayer}
              onUnlistPlayer={unlistPlayer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
