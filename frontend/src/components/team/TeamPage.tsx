import { useTeam } from "@/contexts/TeamContext";
import { useMarket } from "@/contexts/MarketContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import ListPlayerDialog from "../transfer/ListPlayerDialog";
import { ArrowLeft, Edit2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Player, Position } from "@/types/database";

export default function TeamPage() {
  const { players, loading, error, refreshTeam } = useTeam();
  const { listPlayer, unlistPlayer } = useMarket();
  const [showListDialog, setShowListDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const positions: Position[] = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ];

  const handleListPlayer = async (playerId: string, price: number) => {
    try {
      await listPlayer(playerId, price);
      await refreshTeam();
      setShowListDialog(false);
    } catch (error) {
      console.error("Failed to list player:", error);
    }
  };

  const handleUnlistPlayer = async (playerId: string) => {
    try {
      await unlistPlayer(playerId);
      await refreshTeam();
    } catch (error) {
      console.error("Failed to unlist player:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const allPlayers = Object.values(players).flat();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Team</h1>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 mb-8">
          <TabsTrigger value="all" className="text-sm sm:text-base">
            All
          </TabsTrigger>
          {positions.map((pos) => (
            <TabsTrigger
              key={pos}
              value={pos}
              className="text-sm sm:text-base whitespace-nowrap"
            >
              {pos}s
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onList={() => {
                  setSelectedPlayer(player);
                  setShowListDialog(true);
                }}
                onUnlist={() => handleUnlistPlayer(player.id)}
              />
            ))}
          </div>
        </TabsContent>

        {positions.map((pos) => (
          <TabsContent key={pos} value={pos}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(players[pos] || []).map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onList={() => {
                    setSelectedPlayer(player);
                    setShowListDialog(true);
                  }}
                  onUnlist={() => handleUnlistPlayer(player.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ListPlayerDialog
        open={showListDialog}
        onOpenChange={setShowListDialog}
        player={selectedPlayer}
        onSubmit={handleListPlayer}
      />
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  onList: () => void;
  onUnlist: () => void;
}

const PlayerCard = ({ player, onList, onUnlist }: PlayerCardProps) => {
  return (
    <Card className="p-4 flex justify-between items-center bg-white">
      <div>
        <h3 className="font-semibold">{player.name}</h3>
        <Badge variant="secondary" className="mt-1">
          {player.position}
        </Badge>
        <div className="text-sm text-muted-foreground mt-1">
          Value: {formatPrice(player.base_price)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {player.is_listed ? (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-2">
              <span>Listed for {formatPrice(player.listing_price!)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-destructive/20"
                onClick={onUnlist}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={onList}>
            <Edit2 className="w-4 h-4 mr-2" />
            List Player
          </Button>
        )}
      </div>
    </Card>
  );
};
