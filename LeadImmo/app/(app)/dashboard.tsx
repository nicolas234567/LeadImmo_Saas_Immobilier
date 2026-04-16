import { View, Text } from 'react-native'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import { typography } from '../constants/theme'

export default function Dashboard() {
  return (
    <Screen>
      <AppText style={typography.title}>Dashboard</AppText>
    </Screen>
  )
}