import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const logoXml = `
<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Moon -->
  <path d="M 85 25 A 8 8 0 0 1 85 35 A 8 8 0 0 1 85 25" fill="#FFD56B"/>
  
  <!-- Stars around moon -->
  <circle cx="75" cy="20" r="2" fill="#FAFAFA"/>
  <circle cx="95" cy="18" r="2" fill="#FAFAFA"/>
  <circle cx="70" cy="30" r="2" fill="#FAFAFA"/>
  <circle cx="100" cy="28" r="2" fill="#FAFAFA"/>
  <circle cx="80" cy="40" r="2" fill="#FAFAFA"/>
  <circle cx="90" cy="42" r="2" fill="#FAFAFA"/>
  <circle cx="65" cy="25" r="2" fill="#FAFAFA"/>
  <circle cx="105" cy="35" r="2" fill="#FAFAFA"/>
  
  <!-- Upper sun -->
  <path d="M 100 45 A 15 15 0 0 1 100 55 A 15 15 0 0 1 100 45" fill="#FFD56B"/>
  
  <!-- Water wave -->
  <path d="M 70 55 Q 85 50 100 55 Q 115 60 130 55" stroke="#6ECEDA" stroke-width="4" fill="none"/>
  
  <!-- Lower sun reflection -->
  <path d="M 100 65 A 15 15 0 0 1 100 75 A 15 15 0 0 1 100 65" fill="#6ECEDA"/>
  
  <!-- Sun rays -->
  <line x1="100" y1="75" x2="100" y2="85" stroke="#FFD56B" stroke-width="3"/>
  <line x1="95" y1="78" x2="90" y2="88" stroke="#FFD56B" stroke-width="3"/>
  <line x1="105" y1="78" x2="110" y2="88" stroke="#FFD56B" stroke-width="3"/>
  <line x1="92" y1="82" x2="85" y2="90" stroke="#FFD56B" stroke-width="3"/>
  <line x1="108" y1="82" x2="115" y2="90" stroke="#FFD56B" stroke-width="3"/>
  
  <!-- MANISERA text -->
  <text x="100" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E2A38">MANISERA</text>
</svg>
`;

interface LogoProps {
  width?: number;
  height?: number;
  style?: any;
}

export default function Logo({ width = 200, height = 120, style }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <SvgXml xml={logoXml} width={width} height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
