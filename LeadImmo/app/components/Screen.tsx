import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <View style={{ flex: 1, padding: 16, width: '100%', alignItems: 'center' }}>
        {children}
      </View>
    </SafeAreaView>
  )
}