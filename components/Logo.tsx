import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const logoXml = `
<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <!-- MANISERA text with integrated symbols - centered -->
  <g font-family="serif" font-size="36" font-weight="bold" fill="#1E2A38" transform="translate(69, 0)">
    <!-- M with integrated moon (moon forms the left stroke of M) -->
    <text x="20" y="55">M</text>
    <!-- Moon integrated into left stroke of M -->
    <path d="M 25 40 A 8 8 0 0 1 25 50 A 8 8 0 0 1 25 40" fill="#FFD56B"/>
    
    <!-- A -->
    <text x="60" y="55">A</text>
    
    <!-- N -->
    <text x="90" y="55">N</text>
    <!-- Star above N -->
    <path d="M 95 30 L 97 35 L 102 35 L 98 38 L 100 43 L 95 40 L 90 43 L 92 38 L 88 35 L 93 35 Z" fill="#FFD56B"/>
    
    <!-- I -->
    <text x="120" y="55">I</text>
    
    <!-- S with integrated sun -->
    <text x="140" y="55">S</text>
    <!-- Sun integrated into S (at bottom curve) -->
    <circle cx="145" cy="50" r="5" fill="#FFD56B"/>
    <line x1="145" y1="45" x2="145" y2="38" stroke="#FFD56B" stroke-width="2"/>
    <line x1="140" y1="47" x2="135" y2="42" stroke="#FFD56B" stroke-width="2"/>
    <line x1="150" y1="47" x2="155" y2="42" stroke="#FFD56B" stroke-width="2"/>
    <line x1="142" y1="53" x2="138" y2="57" stroke="#FFD56B" stroke-width="2"/>
    <line x1="148" y1="53" x2="152" y2="57" stroke="#FFD56B" stroke-width="2"/>
    
    <!-- E -->
    <text x="170" y="55">E</text>
    <!-- Star above E -->
    <path d="M 175 30 L 177 35 L 182 35 L 178 38 L 180 43 L 175 40 L 170 43 L 172 38 L 168 35 L 173 35 Z" fill="#FFD56B"/>
    
    <!-- R -->
    <text x="200" y="55">R</text>
    <!-- Star below R -->
    <path d="M 205 60 L 207 65 L 212 65 L 208 68 L 210 73 L 205 70 L 200 73 L 202 68 L 198 65 L 203 65 Z" fill="#FFD56B"/>
    
    <!-- A -->
    <text x="230" y="55">A</text>
    <!-- Star below A -->
    <path d="M 235 60 L 237 65 L 242 65 L 238 68 L 240 73 L 235 70 L 230 73 L 232 68 L 228 65 L 233 65 Z" fill="#FFD56B"/>
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
