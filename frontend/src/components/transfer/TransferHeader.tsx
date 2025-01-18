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
    <Card className="w-full h-20 bg-white px-6">
      <div className="h-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Transfer Market</h1>
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-md">
            <span className="text-sm text-muted-foreground">
              Available Budget:
            </span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(budget)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/team">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" /> My Team
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
