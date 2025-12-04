import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';
import { BoardState, Player } from '../services/GameEngine';

interface BoardProps {
  board: BoardState;
  onCellPress: (index: number) => void;
  disabled: boolean;
  winningLine: number[] | null;
}

const { width, height } = Dimensions.get('window');

const Board: React.FC<BoardProps> = ({ board, onCellPress, disabled, winningLine }) => {
  // Calculate board size dynamically to fit screen
  // Use 85% of width, but cap it at a reasonable max size
  // Also ensure it fits vertically by checking height (subtracting header/footer approx)
  const maxBoardSize = 340;
  const availableHeight = height * 0.5; // Roughly 50% of screen height for board
  const boardSize = Math.min(width * 0.85, availableHeight, maxBoardSize);
  
  const cellSize = (boardSize - 70) / 3; // 30 for margins/padding (5*2 padding + 5*2 gap approx)

  return (
    <View style={[styles.board]}>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell as Player | null}
          onPress={() => onCellPress(index)}
          disabled={disabled}
          isWinningCell={winningLine?.includes(index) ?? false}
          size={cellSize}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export default Board;
