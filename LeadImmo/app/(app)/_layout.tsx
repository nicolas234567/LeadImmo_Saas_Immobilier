import { Tabs } from 'expo-router'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="leads/index" options={{ title: 'Leads' }} />
      <Tabs.Screen name="properties/index" options={{ title: 'Biens' }} />
    </Tabs>
  )
}