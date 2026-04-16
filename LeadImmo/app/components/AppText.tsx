import { Text } from 'react-native'
import { colors } from '../constants/theme'

export default function AppText({ children, style }: { children: React.ReactNode, style?: any }) {
  return (
    <Text style={[{ color: colors.white, fontSize: 14 }, style]}>
      {children}
    </Text>
  )
}