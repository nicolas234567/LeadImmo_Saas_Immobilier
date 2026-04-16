import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'

export default function ResetMdp() {
  return (
    <Screen> 
            <View style={styles.container}>
                <View style={styles.form}>
                    <AppText>Un email de réinitialisation vous a été envoyé.</AppText>
                </View>
                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <AppText>Retourner à la page de connexion</AppText>
                    </TouchableOpacity>
                </View>
            </View>
    </Screen>
  )
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 120,
  },
    form: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 4,
  }
}