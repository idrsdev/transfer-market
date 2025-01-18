import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, RotateCcw } from "lucide-react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Position } from "@/types/database";
import { useCallback, useEffect, useState } from "react";

interface MarketFilters {
  search?: string;
  team?: string;
  min_price?: number;
  max_price?: number;
  position?: Position;
  page?: number;
  pageSize?: number;
}

interface SearchFiltersProps {
  filters: MarketFilters;
  onFiltersChange: (filters: MarketFilters) => void;
  onReset: () => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onReset,
}: SearchFiltersProps) {
  const positions: Position[] = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ];

  const [localMinPrice, setLocalMinPrice] = useState<string>(
    filters.min_price?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    filters.max_price?.toString() || ""
  );
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFiltersChange({ ...filters, search: value });
    }, 1000),
    [filters, onFiltersChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFiltersChange({
        ...filters,
        min_price: localMinPrice ? Number(localMinPrice) : undefined,
        max_price: localMaxPrice ? Number(localMaxPrice) : undefined,
      });
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="w-full h-16 px-4 py-2 bg-white border-b flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search players..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-48">
        <Select
          value={filters.position || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              position: value === "all" ? undefined : (value as Position),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Label className="text-sm">Price Range:</Label>
        <Input
          type="number"
          placeholder="Min"
          className="w-24"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          onKeyDown={handlePriceKeyPress}
        />
        <span>-</span>
        <Input
          type="number"
          placeholder="Max"
          className="w-24"
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          onKeyDown={handlePriceKeyPress}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setLocalMinPrice("");
          setLocalMaxPrice("");
          setSearchTerm("");
          onReset();
        }}
        className="ml-2"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
