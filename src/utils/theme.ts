import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    tertiary: '#018786',
    error: '#B00020',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    tertiary: '#03DAC6',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
  },
};

export type AppTheme = typeof lightTheme;
