import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface TransferHeaderProps {
  budget: number;
}

export default function TransferHeader({ budget }: TransferHeaderProps) {
  return (
    <Card className="w-full h-16 sm:h-20 bg-white px-4 sm:px-6">
      <div className="h-full flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold">Transfer Market</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 bg-primary/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md cursor-help">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(budget)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Available Budget</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center">
          <Link to="/team">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:text-base sm:h-10"
                  >
                    <Users className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">My Team</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View your team</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      </div>
    </Card>
  );
}
