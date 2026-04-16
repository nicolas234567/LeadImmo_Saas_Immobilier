import { View, Text } from 'react-native'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { typography } from '../../constants/theme'

export default function Leads() {
  return (
    <Screen>
      <AppText style={typography.title}>Leads</AppText>
    </Screen>
  )
}