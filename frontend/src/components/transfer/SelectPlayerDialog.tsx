import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  isOwned: boolean;
}

interface SelectPlayerDialogProps {
  open?: boolean;
  players?: Player[];
  onOpenChange?: (open: boolean) => void;
  onPlayerSelect?: (playerId: string) => void;
}

const SelectPlayerDialog = ({
  open = true,
  players = [],
  onOpenChange = () => {},
  onPlayerSelect = () => {},
}: SelectPlayerDialogProps) => {
  const [selectedPlayer, setSelectedPlayer] = React.useState<string>("");
  const ownedPlayers = players.filter((p) => p.isOwned);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer) {
      onPlayerSelect(selectedPlayer);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Player to List</DialogTitle>
          <DialogDescription>
            Choose one of your players to list on the transfer market
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="player">Select Player</Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a player" />
              </SelectTrigger>
              <SelectContent>
                {ownedPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} - {player.position} ({player.team})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedPlayer}>
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPlayerDialog;
