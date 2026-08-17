import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

/**
 * Mr. Olla mascot — friendly purple/blue robot teacher.
 * Same visual language as web/components/learn/MrOllaAvatar.js.
 */
export default function MrOllaAvatar({ size = 48, glow = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {glow && <Circle cx="32" cy="32" r="30" fill="#a78bfa" opacity={0.25} />}
      {/* head */}
      <Rect x="14" y="16" width="36" height="32" rx="10" fill="#6366f1" />
      <Rect x="14" y="16" width="36" height="14" rx="10" fill="#818cf8" />
      {/* antenna */}
      <Path d="M32 8 L32 16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="32" cy="7" r="2.5" fill="#fbbf24" />
      {/* eyes */}
      <G>
        <Circle cx="24" cy="30" r="4" fill="#0f172a" />
        <Circle cx="40" cy="30" r="4" fill="#0f172a" />
        <Circle cx="25.5" cy="28.5" r="1.4" fill="#fff" />
        <Circle cx="41.5" cy="28.5" r="1.4" fill="#fff" />
      </G>
      {/* smile */}
      <Path
        d="M24 40 Q32 46 40 40"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* side lights */}
      <Circle cx="14" cy="32" r="2" fill="#fbbf24" />
      <Circle cx="50" cy="32" r="2" fill="#fbbf24" />
      {/* neck */}
      <Rect x="28" y="48" width="8" height="4" fill="#4f46e5" />
      {/* body hint */}
      <Rect x="20" y="52" width="24" height="6" rx="3" fill="#3730a3" />
    </Svg>
  );
}
