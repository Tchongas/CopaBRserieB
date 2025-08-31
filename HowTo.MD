# Copa BR Série B Overlay Files

## Original Complete Overlay
- `overlay.html` - Complete overlay with all components
  - Link example: `overlay.html?player1=Player%20One&player2=Player%20Two&player1ign=PlayerOneIGN&player2ign=PlayerTwoIGN&points1=3&points2=0&commentary1=Thomas&commentary2=Xander`

## Individual OBS Components

### Team Names
- `team-names.html` - Home and away team names display

### Player Elements
- `player-heads.html` - Player avatar images
- `player-info.html` - Player names, ELO ratings, and PB times

### Match Information
- `pb-times.html` - PB times and "PB RANKED" labels
- `points.html` - Match point squares for both players
- `timer.html` - Match timer display

### Stream Elements
- `commentators.html` - Commentator title and names
- `commands.html` - Chat commands (discord, torneio, runners)

## Usage in OBS
Add each file as a separate Browser Source in OBS for independent control of visibility and positioning. All files use the same CSS (`styles.css`) and JavaScript (`index.js`) for consistent styling and functionality.