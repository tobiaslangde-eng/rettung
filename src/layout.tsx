import { ReactNode, createContext, useContext } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { spacing } from './theme';

/**
 * Responsives Layout: Handy (eine Spalte), Tablet/iPad (zwei Spalten) und PC/Mac (Seitenleiste + drei Spalten).
 * Die Breite bezieht sich auf den Inhaltsbereich (ohne Seitenleiste), damit jeder Bildschirm weiß,
 * wie viel Platz er wirklich hat.
 */
export type LayoutMode = 'phone' | 'tablet' | 'desktop';

export const SIDEBAR_WIDTH = 264;
/** Ab dieser Fensterbreite gibt es links eine feste Seitenleiste */
export const SIDEBAR_FROM = 1000;

const FrameWidth = createContext<number | null>(null);
export const FrameWidthProvider = FrameWidth.Provider;

export function modeFor(width: number): LayoutMode {
  if (width >= 980) return 'desktop';
  if (width >= 680) return 'tablet';
  return 'phone';
}

export function useLayout() {
  const win = useWindowDimensions();
  const width = useContext(FrameWidth) ?? win.width;
  const mode = modeFor(width);
  return { width, height: win.height, mode, wide: mode !== 'phone', desktop: mode === 'desktop' };
}

/** Desktop-App (Electron) – erkennbar am User-Agent der Web-Version */
const ua = Platform.OS === 'web' && typeof navigator !== 'undefined' ? navigator.userAgent : '';
export const desktopShell: 'mac' | 'windows' | null = /Electron/.test(ua)
  ? /Macintosh|Mac OS X/.test(ua)
    ? 'mac'
    : /Windows/.test(ua)
      ? 'windows'
      : null
  : null;

/** Mehrere Spalten nebeneinander – auf dem Handy einfach untereinander. */
export function Columns({ wide, cols, weights, gap = spacing.lg }: { wide: boolean; cols: ReactNode[]; weights?: number[]; gap?: number }) {
  if (!wide) return <>{cols}</>;
  return (
    <View style={{ flexDirection: 'row', gap, alignItems: 'flex-start' }}>
      {cols.map((c, i) => (
        <View key={i} style={{ flex: weights?.[i] ?? 1, minWidth: 0, gap: spacing.lg }}>
          {c}
        </View>
      ))}
    </View>
  );
}
