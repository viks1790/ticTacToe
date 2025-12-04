import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

const XIcon: React.FC<IconProps> = ({ size = 50, color = '#FF5252' }) => {
  const thickness = size * 0.15;
  const length = size * 1.0;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={[
          styles.line,
          {
            width: length,
            height: thickness,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.line,
          {
            width: length,
            height: thickness,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    borderRadius: 5,
  },
});

export default XIcon;
