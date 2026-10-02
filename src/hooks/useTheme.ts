import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme, setThemeMode } from '@/store/slices/themeSlice';
import { THEME_COLORS, ThemeColors, SPACING, RADIUS, TYPOGRAPHY, LAYOUT } from '@/constants';
import { ThemeMode } from '@/types';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const colors: ThemeColors = THEME_COLORS[mode];
  const isDark = mode === 'dark';

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSetMode = (newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  };

  return {
    mode,
    colors,
    isDark,
    spacing: SPACING,
    radius: RADIUS,
    typography: TYPOGRAPHY,
    layout: LAYOUT,
    toggleTheme: handleToggle,
    setThemeMode: handleSetMode,
  };
};
