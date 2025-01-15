# Football Manager Transfer Market - Frontend Requirements

## Core User Flows

### Authentication Flow

-   Combined login/signup page (`/auth`)
-   Automatic redirection based on `has_completed_setup`:
    -   `false` → Team Creation Flow
    -   `true` → Transfer Market (Home)

### Team Creation Flow (`/setup`)

1. **Step 1: Team Setup**

    - Team name input
    - Budget display (£5,000,000)

2. **Step 2: Squad Configuration**
    - Position quotas:
        - 3 Goalkeepers
        - 6 Defenders
        - 6 Midfielders
        - 5 Forwards
    - Auto-generated players with:
        - Random names
        - Random prices (100k-500k)
    - Editable fields:
        - Player names
        - Base prices
    - Real-time validation

## Main Application Screens

### Global Header (Present on all authenticated pages)

-   App logo/name
-   Current budget display
-   Navigation:
    -   Transfer Market
    -   My Team
    -   List Player Action
    -   Sign Out

### Transfer Market (Home Page)

1. **Search & Filters**

    - Player name search
    - Team filter
    - Position filter
    - Price range filter
    - Listed/Unlisted toggle

2. **Player Grid**
    - Pagination (8 players per page)
    - Player cards showing:
        - Name
        - Position
        - Team
        - Base/Listing price
        - Action buttons

### Team Management (`/team`)

-   Position-based player organization
-   Current squad overview
-   Player actions:
    -   List for transfer
    -   Unlist from transfer
-   Team statistics

## Key Components

### Dialogs

1. **List Player Dialog**

    - Price input
    - Validation
    - Confirmation

2. **Buy Player Dialog**

    - Price confirmation
    - Budget check
    - Transaction confirmation

3. **Transaction Result Dialog**
    - Success/Failure feedback
    - Updated budget display
    - Next actions
