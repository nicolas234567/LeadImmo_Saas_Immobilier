import { Text } from 'react-native'
import { colors } from '../constants/theme'

export default function AppText({ children, style, numberOfLines }: { children: React.ReactNode; style?: any; numberOfLines?: number }) {
  return (
    <Text style={[{ color: colors.white, fontSize: 14 }, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}