import { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ResetMdp() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()

  function handleSubmit() {
    if (!email) {
      setEmailError('Email requis')
      return
    }
    if (!isValidEmail(email)) {
      setEmailError('Format email invalide')
      return
    }
    router.push('/(auth)/confirmationResetMdp')
  }

  return (
    <Screen>
      <AppText style={typography.title}>Mot de passe oublié</AppText>

      <View style={styles.form}>
        <AppText style={styles.description}>
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </AppText>

        <View style={styles.field}>
          <AppText style={styles.label}>Email</AppText>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="votre@email.com"
            placeholderTextColor={colors.lightGray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={t => { setEmail(t); setEmailError(undefined) }}
          />
          {emailError ? <AppText style={styles.errorText}>{emailError}</AppText> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <AppText style={styles.buttonText}>Réinitialiser le mot de passe</AppText>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <AppText style={styles.loginText}>Retour à la </AppText>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={styles.loginLink}>connexion</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  form: {
    marginTop: 48,
    gap: spacing.md,
  },
  description: {
    color: colors.lightGray,
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.white,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.gray800,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.lightGray,
    fontSize: 14,
  },
  loginLink: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '600' as const,
  },
})
