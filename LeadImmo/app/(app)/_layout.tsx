import { Tabs } from 'expo-router'
import { Image } from 'react-native'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../assets/images/icons/dashboard.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leads/index"
        options={{
          title: 'Leads',
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../assets/images/icons/leads.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="properties/index"
        options={{
          title: 'Biens',
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../assets/images/icons/properties.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen name="leads/[id]" options={{ href: null }} />
      <Tabs.Screen name="properties/[id]" options={{ href: null }} />
    </Tabs>
  )
}