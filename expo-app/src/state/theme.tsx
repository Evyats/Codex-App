import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { loadJSON, saveJSON } from './storage';

type PaletteColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
};

type ThemePalette = {
  id: string;
  name: string;
  light: PaletteColors;
  dark: PaletteColors;
};

type ThemePaletteContextValue = {
  palettes: ThemePalette[];
  paletteId: string;
  setPaletteId: (id: string) => void;
  palette: ThemePalette;
};

const STORAGE_KEY = 'theme/palette/v1';

const PALETTES: ThemePalette[] = [
  {
    id: 'mist',
    name: 'Misty Blue',
    light: { primary: '#8fbaff', secondary: '#b6d5ff', background: '#f6f9ff', surface: '#ffffff' },
    dark: { primary: '#7fb2ff', secondary: '#9cc6ff', background: '#0d1729', surface: '#121f36' },
  },
  {
    id: 'sky',
    name: 'Soft Sky',
    light: { primary: '#7db6ff', secondary: '#a7d3ff', background: '#f7faff', surface: '#ffffff' },
    dark: { primary: '#6eaaff', secondary: '#90c1ff', background: '#0c1628', surface: '#111d33' },
  },
  {
    id: 'ice',
    name: 'Icy Air',
    light: { primary: '#9bbdf0', secondary: '#c7ddff', background: '#f5f8ff', surface: '#ffffff' },
    dark: { primary: '#88aee8', secondary: '#a6c7f5', background: '#101a2c', surface: '#16233b' },
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    light: { primary: '#6fb6e8', secondary: '#a0d3f5', background: '#f4fbff', surface: '#ffffff' },
    dark: { primary: '#5aa6dc', secondary: '#7fc6ee', background: '#0b1a26', surface: '#122435' },
  },
  {
    id: 'steel',
    name: 'Blue Steel',
    light: { primary: '#86a7d9', secondary: '#b3c7e8', background: '#f5f7fb', surface: '#ffffff' },
    dark: { primary: '#7699cc', secondary: '#9cb6dd', background: '#0f1724', surface: '#162234' },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    light: { primary: '#b58900', secondary: '#2aa198', background: '#fdf6e3', surface: '#eee8d5' },
    dark: { primary: '#b58900', secondary: '#2aa198', background: '#002b36', surface: '#073642' },
  },
];

const DEFAULT_PALETTE_ID = 'sky';

const ThemePaletteContext = createContext<ThemePaletteContextValue | null>(null);

export function ThemePaletteProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadJSON<string>(STORAGE_KEY);
      if (!isMounted) return;
      if (stored && PALETTES.some((palette) => palette.id === stored)) {
        setPaletteId(stored);
      }
      setHydrated(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, paletteId);
  }, [paletteId, hydrated]);

  const palette = useMemo(
    () => PALETTES.find((entry) => entry.id === paletteId) ?? PALETTES[0],
    [paletteId]
  );

  const value = useMemo(
    () => ({
      palettes: PALETTES,
      paletteId,
      setPaletteId,
      palette,
    }),
    [palette, paletteId]
  );

  return <ThemePaletteContext.Provider value={value}>{children}</ThemePaletteContext.Provider>;
}

export function useThemePalette() {
  const ctx = useContext(ThemePaletteContext);
  if (!ctx) {
    throw new Error('useThemePalette must be used within ThemePaletteProvider');
  }
  return ctx;
}
