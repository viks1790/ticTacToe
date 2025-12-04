import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import XIcon from '../../assets/tictactoe/XIcon';
import OIcon from '../../assets/tictactoe/OIcon';
import { Player } from '../services/GameEngine';

interface CellProps {
  value: Player | null;
  onPress: () => void;
  disabled: boolean;
  isWinningCell: boolean;
  size: number;
}

const Cell: React.FC<CellProps> = ({ value, onPress, disabled, isWinningCell, size }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [value]);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { width: size, height: size },
        isWinningCell && styles.winningCell,
      ]}
      onPress={onPress}
      disabled={disabled || value !== null}
      activeOpacity={0.7}
      accessibilityLabel={value ? `Cell filled with ${value}` : "Empty cell"}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {value === 'X' && <XIcon size={size * 0.6} />}
        {value === 'O' && <OIcon size={size * 0.6} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  winningCell: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },
});

export default Cell;
