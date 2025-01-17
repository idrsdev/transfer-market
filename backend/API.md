Notes for the API Planning & implementation!

## Interfaces

// User (auth.users table)
interface User {
id: string;
email: string;
password: string;
has_completed_setup: false; // default
team_id: string | null; // Reference to teams table
balance: number; // User's available budget
}

// Team
interface Team {
id: string;
name: string;
created_at: Date;
}

// Player
interface Player {
id: string;
name: string;
team_id: string;
position: string; // (enum: 'Goalkeeper', 'Defender', 'Midfielder', 'Forward')
base_price: number;
is_listed: boolean;
listing_price: number | null;
}

// Transfer
interface Transfer {
id: string;
player_id: string;
from_team_id: string;
to_team_id: string;
price: number;
created_at: Date;
}

## API Routes

1.  Get /api/login-or-signup

    ```javascript
    Request: {
        email: string;
        password: string;
    }

    Response: {
        token: string;
        user: {
            id: string;
            email: string;
            has_completed_setup: boolean;
            team_id: string | null;
            balance: number;
        }
    }
    ```

2.  GET /api/teams (Limit to 10, searchable/filterable)

    ```
    Query Parameters:
    {
        search?: string; // Search by team name
        limit?: number; // Default: 10
    }
    Response:
    {
        teams: Team[];
    }
    ```

3.  POST /api/teams
    Set team_id in users table
    Set has_completed_setup: true; in users table
    On Success:
    1. has_completed_setup: true in our local System
    2. set in our user's info in the token ? team_id
    3. Or return a new token with team included ?

```
    Request:
    {
      "name": "Team Name",
      "players": [
        {
          "name": "Player Name",
          "position": "Position",
          "base_price": 1000000
        }
      ]
    }
    Response:
    {
        team: Team;
        players: Player[];
    }
```

4. GET /api/teams/me/players

```
Response:
{
  Goalkeeper: Player[];
  Defender: Player[];
  Midfielder: Player[];
  Forward: Player[];
}
```

5.  GET /api/players

```
Query Parameters:
{
  page?: number;          // Default: 1
  pageSize?: number;      // Default: 8
  search?: string;        // Search by player name
  team?: string;          // Filter by team
  min_price?: number;     // Filter by minimum price
  max_price?: number;     // Filter by maximum price
  position?: string;      // Filter by position
  is_listed?: boolean;    // Default: true
}
Response:
{
  players: Player[];
  totalPages: number;
}
```

6.  POST /api/players/:id/list
    Description: List a player for transfer.

```
Request:
{
  listing_price: number;
}
Response: Player
```

7.  POST /api/players/:id/unlist
    Description: Unlist a player from transfer.
    POST /api/players/:id/unlist
    Response: Player

8.  POST /api/players/:id/buy
    POST /api/players/:id/buy
    Validations:

    -   Check if player exists and is listed
    -   Check if buyer has sufficient balance (95% of listing price)
    -   Check if buyer's team has correct position quota (Optional Feaures!)

    Response:
    {
    player: Player;
    transfer: Transfer;
    new_balance: number;
    }
