import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={typography.title}>Connexion</Text>
      <View>
        <Text style={typography.label}>Email :</Text>
        <TextInput
          defaultValue="identifiant"
        />
        <Text style={typography.label}>Mot de passe :</Text>
        <TextInput
          defaultValue="mot de passe"
        />
      </View>
      <TouchableOpacity onPress={() => router.push('/(app)/dashboard')}>
        <Text>Se connecter</Text>
      </TouchableOpacity>
    </View>
  )
}