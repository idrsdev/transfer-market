export interface User {
  id: string;
  email: string;
  has_completed_setup: boolean;
  team_id: string | null;
  balance: number;
}

export interface Team {
  id: string;
  name: string;
  created_at: Date;
}

export interface Player {
  id: string;
  name: string;
  team_id: string;
  team?: Team;
  position: string;
  base_price: number;
  is_listed: boolean;
  listing_price: number | null;
}

export interface Transfer {
  id: string;
  player_id: string;
  from_team_id: string;
  to_team_id: string;
  price: number;
  created_at: Date;
}

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
