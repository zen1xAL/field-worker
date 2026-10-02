import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { TaskDetailScreen } from '@/screens/TaskDetailScreen';
import { CreateEditTaskScreen } from '@/screens/CreateEditTaskScreen';
import { useTheme } from '@/hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isDark, colors } = useTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="CreateEditTask"
          component={CreateEditTaskScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
