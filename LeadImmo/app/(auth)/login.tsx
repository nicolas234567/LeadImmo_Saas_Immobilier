import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'

export default function Login() {
  return (
    <Screen>
      <AppText style={typography.title}>Connexion</AppText>
        <View style={styles.container}>
        <View style={styles.form}>
          <AppText style={typography.label}>Email :</AppText>
          <TextInput style={styles.input}
            defaultValue="compte_test_identifiant"
          />
          <AppText style={typography.label}>Mot de passe :</AppText>
          <TextInput style={styles.input}
            defaultValue="compte_test_mdp"
          />
        </View>
        <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => router.push('/(app)/dashboard')}>
            <AppText>Se connecter</AppText>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => router.push('/(auth)/resetMdp')}>
            <AppText>mot de passe oublié ?</AppText>
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