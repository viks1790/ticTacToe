# Tic-Tac-Toe React Native App

A production-quality Tic-Tac-Toe mobile app built with React Native and TypeScript.

## Features

- **Single Player vs CPU**:
  - **Easy**: Random moves.
  - **Hard**: Unbeatable Minimax AI.
- **Local Multiplayer**: Pass-and-play on the same device.
- **Persistence**: Remembers player names and scores across sessions.
- **Polished UI**: Clean design, animations, and accessibility support.

## Getting Started

### Prerequisites

- Node.js >= 16
- React Native environment setup (Android/iOS)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

   _Note: This project uses `@react-native-async-storage/async-storage`._

2. Install iOS pods (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

- **Android**:
  ```bash
  npm run android
  ```
- **iOS**:
  ```bash
  npm run ios
  ```

## Testing

Run the unit tests for the game engine (Minimax, Win/Draw logic):

```bash
npm test
```

## Project Structure

- `src/components`: UI components (Board, Cell, Modals).
- `src/services`: Game logic (GameEngine) and SyncService stub.
- `src/screens`: Main game screen.
- `src/hooks`: Custom hooks (usePersistentState).
- `assets/tictactoe`: Vector icon components.

## Architecture

- **GameEngine**: Pure functions for game logic, ensuring testability.
- **Minimax**: Recursive algorithm for the Hard CPU difficulty.
- **State Management**: React State for UI, AsyncStorage for persistence.
