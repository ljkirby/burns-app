import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AIAnalysisScreen from './screens/AIAnalysisScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import ProtocolScreen from './screens/ProtocolScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'AI Analysis') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Calculator') {
              iconName = focused ? 'calculator' : 'calculator-outline';
            } else if (route.name === 'Protocol') {
              iconName = focused ? 'git-network' : 'git-network-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="AI Analysis" component={AIAnalysisScreen} />
        <Tab.Screen name="Calculator" component={CalculatorScreen} />
        <Tab.Screen name="Protocol" component={ProtocolScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
