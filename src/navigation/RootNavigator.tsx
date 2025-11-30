import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import GoalDetailScreen from '../screens/GoalDetailScreen';
import MonthlyReviewScreen from '../screens/MonthlyReviewScreen';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainApp"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GoalDetail"
              component={GoalDetailScreen}
              options={{ title: '목표 상세' }}
            />
            <Stack.Screen
              name="MonthlyReview"
              component={MonthlyReviewScreen}
              options={{ title: '월별 회고' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
