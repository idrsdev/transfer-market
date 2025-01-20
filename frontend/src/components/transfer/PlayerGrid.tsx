import PlayerCard from "./PlayerCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { Player } from "@/types/database";
import { useState } from "react";
import ListPlayerDialog from "./ListPlayerDialog";
import { useMarket } from "@/contexts/MarketContext";
import { useTeam } from "@/contexts/TeamContext";
import { Info } from "lucide-react";

interface PlayerGridProps {
  players: Player[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBuyPlayer: (playerId: string) => void;
  onListPlayer: (playerId: string, price: number) => void;
  onUnlistPlayer: (playerId: string) => void;
}

export default function PlayerGrid({
  players,
  currentPage,
  totalPages,
  onPageChange,
  onBuyPlayer,
  onListPlayer,
  onUnlistPlayer,
}: PlayerGridProps) {
  const { user } = useAuth();
  const { refreshMarket } = useMarket();
  const { refreshTeam } = useTeam();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showListDialog, setShowListDialog] = useState(false);

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setShowListDialog(true);
  };

  const handleUnlistPlayer = async (playerId: string) => {
    try {
      await onUnlistPlayer(playerId);
      // We could just remove this player manually!
      await refreshMarket();
      await refreshTeam();
    } catch (error) {
      console.error("Failed to unlist player:", error);
    }
  };

  const handleListSubmit = async (playerId: string, price: number) => {
    try {
      await onListPlayer(playerId, price);
      // We could just remove this player manually!
      await refreshMarket();
      await refreshTeam();
      setShowListDialog(false);
      setSelectedPlayer(null);
    } catch (error) {
      console.error("Failed to list player:", error);
    }
  };

  if (players.length === 0) {
    return (
      <div className="w-full min-h-[400px] bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center">
          <Info className="mr-2 text-blue-500" /> {/* Icon with margin */}
          <p className="text-blue-600 text-xl font-semibold">
            No players found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            name={player.name}
            team={player.team?.name}
            position={player.position}
            price={player.listing_price || player.base_price}
            isOwned={player.team?.id === user?.team_id}
            isListed={player.is_listed}
            onBuy={() => onBuyPlayer(player.id)}
            onEdit={() => handleEdit(player)}
            onUnlist={() => handleUnlistPlayer(player.id)}
          />
        ))}
      </div>

      {selectedPlayer && (
        <ListPlayerDialog
          open={showListDialog}
          onOpenChange={(open) => {
            setShowListDialog(open);
            if (!open) setSelectedPlayer(null);
          }}
          onSubmit={handleListSubmit}
          player={selectedPlayer}
          // isEdit={selectedPlayer.is_listed}
        />
      )}
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent className="flex items-center gap-1 sm:gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={`h-8 sm:h-9 px-2 sm:px-3 ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page} className="hidden sm:block">
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className="h-8 sm:h-9 w-8 sm:w-9"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="sm:hidden">
              <span className="px-2 text-sm">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={`h-8 sm:h-9 px-2 sm:px-3 ${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
