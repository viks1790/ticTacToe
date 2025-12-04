import React from 'react';
import { View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

const OIcon: React.FC<IconProps> = ({ size = 50, color = '#448AFF' }) => {
  const thickness = size * 0.15;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: thickness,
        borderColor: color,
      }}
    />
  );
};

export default OIcon;
