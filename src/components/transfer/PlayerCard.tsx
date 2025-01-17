import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit2, ShoppingCart, Tag } from "lucide-react";

interface PlayerCardProps {
  name?: string;
  team?: string;
  position?: string;
  price?: number;
  isOwned?: boolean;
  isListed?: boolean;
  onBuy?: () => void;
  onEdit?: () => void;
  onUnlist?: () => void;
}

const PlayerCard = ({
  name = "John Doe",
  team = "Example FC",
  position = "Forward",
  price = 1000000,
  isOwned = false,
  isListed = false,
  onBuy = () => {},
  onEdit = () => {},
  onUnlist = () => {},
}: PlayerCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPositionVariant = (pos: string) => {
    switch (pos.toLowerCase()) {
      case "goalkeeper":
        return "default";
      case "defender":
        return "secondary";
      case "midfielder":
        return "outline";
      case "forward":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-[300px] h-[200px] bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{team}</p>
            {isListed && (
              <Badge variant="secondary" className="mt-1">
                <Tag className="w-3 h-3 mr-1" /> Listed
              </Badge>
            )}
          </div>
          <Badge variant={getPositionVariant(position)} className="px-2 py-1">
            {position}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-center text-primary">
          {formatPrice(price)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <TooltipProvider>
          {isOwned ? (
            <div className="flex gap-2">
              {isListed ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={onUnlist}
                      >
                        Remove Listing
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove this player from transfer list</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={onEdit}>
                        Edit Price
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change listing price</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={onEdit}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      List Player
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>List player for sale</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={onBuy}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Player
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Purchase this player</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
