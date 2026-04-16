import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { colors, typography } from './../constants/theme'
import { router } from 'expo-router/build/exports'
import Screen from './../components/Screen'
import AppText from './../components/AppText'

export default function ResetMdp() {
  return (
    <Screen>
        <AppText style={typography.title}>Mot de passe oublié</AppText> 
            <View style={styles.container}>
                <View style={styles.form}>
                    <AppText style={typography.label}>identifiant :</AppText>
                    <TextInput style={styles.input}/>
                </View>
                <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => router.push('/(auth)/confirmationResetMdp')}>
                        <AppText>Réinitialiser le mot de passe</AppText>
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