import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const logoXml = `
<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
  <!-- MANISERA text with integrated symbols -->
  <g font-family="serif" font-size="32" font-weight="bold" fill="#1E2A38">
    <!-- M with integrated moon -->
    <text x="20" y="50">M</text>
    <!-- Moon integrated into M -->
    <path d="M 25 35 A 6 6 0 0 1 25 45 A 6 6 0 0 1 25 35" fill="#FFD56B"/>
    
    <!-- A -->
    <text x="50" y="50">A</text>
    
    <!-- N -->
    <text x="80" y="50">N</text>
    <!-- Star above N -->
    <path d="M 85 25 L 87 30 L 92 30 L 88 33 L 90 38 L 85 35 L 80 38 L 82 33 L 78 30 L 83 30 Z" fill="#FFD56B"/>
    
    <!-- I -->
    <text x="110" y="50">I</text>
    
    <!-- S with integrated sun -->
    <text x="130" y="50">S</text>
    <!-- Sun integrated into S -->
    <circle cx="135" cy="45" r="4" fill="#FFD56B"/>
    <line x1="135" y1="41" x2="135" y2="35" stroke="#FFD56B" stroke-width="1.5"/>
    <line x1="130" y1="42" x2="125" y2="37" stroke="#FFD56B" stroke-width="1.5"/>
    <line x1="140" y1="42" x2="145" y2="37" stroke="#FFD56B" stroke-width="1.5"/>
    <line x1="132" y1="48" x2="128" y2="52" stroke="#FFD56B" stroke-width="1.5"/>
    <line x1="138" y1="48" x2="142" y2="52" stroke="#FFD56B" stroke-width="1.5"/>
    
    <!-- E -->
    <text x="160" y="50">E</text>
    <!-- Star above E -->
    <path d="M 165 25 L 167 30 L 172 30 L 168 33 L 170 38 L 165 35 L 160 38 L 162 33 L 158 30 L 163 30 Z" fill="#FFD56B"/>
    
    <!-- R -->
    <text x="190" y="50">R</text>
    <!-- Star below R -->
    <path d="M 195 55 L 197 60 L 202 60 L 198 63 L 200 68 L 195 65 L 190 68 L 192 63 L 188 60 L 193 60 Z" fill="#FFD56B"/>
    
    <!-- A -->
    <text x="220" y="50">A</text>
    <!-- Star below A -->
    <path d="M 225 55 L 227 60 L 232 60 L 228 63 L 230 68 L 225 65 L 220 68 L 222 63 L 218 60 L 223 60 Z" fill="#FFD56B"/>
  </g>
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
