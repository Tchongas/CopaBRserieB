# Copa BR Série B Overlay Files

## Original Complete Overlay
- `overlay.html` - Complete overlay with all components
  - Link example: `overlay.html?player1=Player%20One&player2=Player%20Two&player1ign=PlayerOneIGN&player2ign=PlayerTwoIGN&points1=3&points2=0&commentary1=Thomas&commentary2=Xander`

## Individual OBS Components

### Team Names
- `team-names.html` - Home and away team names display
  - Example: `team-names.html?player1=Carlitos&player2=Floaddy`

### Player Elements
- `player-heads.html` - Player avatar images
  - Example: `player-heads.html?player1ign=Thomas&player2ign=Xande`
- `player-info.html` - Player names, ELO ratings, and PB times
  - Example: `player-info.html?player1=Carlitos&player2=Floaddy&player1elo=900&player2elo=1200&player1pb=18:45&player2pb=19:54`

### Match Information
- `pb-times.html` - PB times and "PB RANKED" labels
  - Example: `pb-times.html?pb1=19:00&pb2=25:00`
- `points.html` - Match point squares for both players
  - Example: `points.html?points1=2&points2=1`
- `timer.html` - Match timer display
  - Example: `timer.html?time=15:30`

### Stream Elements
- `commentators.html` - Commentator title and names
  - Example: `commentators.html?commentary1=Thomas&commentary2=Xande`
- `commands.html` - Chat commands (discord, torneio, runners)
  - Example: `commands.html?cmd1=!discord&cmd2=!torneio&cmd3=!runners`

## Usage in OBS
Add each file as a separate Browser Source in OBS for independent control of visibility and positioning. All files use the same CSS (`styles.css`) and JavaScript (`index.js`) for consistent styling and functionality.