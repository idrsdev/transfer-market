import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Player } from "@/types/database";

interface ListPlayerDialogProps {
  open?: boolean;
  player: Player | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (playerId: string, price: number) => void;
}

export default function ListPlayerDialog({
  open = false,
  player,
  onOpenChange,
  onSubmit,
}: ListPlayerDialogProps) {
  const [price, setPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (player) {
      setPrice(player.listing_price?.toString() || player.base_price.toString());
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player) return;

    const numericPrice = Number(price);
    if (!price || isNaN(numericPrice)) {
      setError("Please enter a valid price");
      return;
    }

    if (numericPrice <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    onSubmit(player.id, numericPrice);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {player?.is_listed
              ? "Edit Player Listing"
              : "List Player for Transfer"}
          </DialogTitle>
          <DialogDescription>
            {player ? `Set an asking price for ${player.name}` : "Loading..."}
          </DialogDescription>
        </DialogHeader>

        {player && (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Player Details</Label>
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span>{player.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Position:</span>
                  <span>{player.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Value:</span>
                  <span>{formatPrice(player.base_price)}</span>
                </div>
                {player.is_listed && player.listing_price && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-sm font-medium">
                      Current Listing:
                    </span>
                    <span>{formatPrice(player.listing_price)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Asking Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="price"
                  type="number"
                  placeholder="1000000"
                  className="pl-9"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setError("");
                  }}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {player.is_listed ? "Update Listing" : "List Player"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
