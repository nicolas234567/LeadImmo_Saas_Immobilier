import { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type FormErrors = { email?: string; password?: string; confirm?: string }

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!email) e.email = 'Email requis'
    else if (!isValidEmail(email)) e.email = 'Format email invalide'
    if (!password) e.password = 'Mot de passe requis'
    else if (password.length < 8) e.password = 'Minimum 8 caractères'
    if (!confirm) e.confirm = 'Confirmation requise'
    else if (confirm !== password) e.confirm = 'Les mots de passe ne correspondent pas'
    return e
  }

  function handleSubmit() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length === 0) setDone(true)
  }

  if (done) {
    return (
      <Screen>
        <View style={styles.successContainer}>
          <AppText style={styles.successIcon}>✓</AppText>
          <AppText style={[typography.title, { textAlign: 'center', marginBottom: spacing.sm }]}>
            Compte créé !
          </AppText>
          <AppText style={styles.successMsg}>
            Votre compte a bien été créé. Vous pouvez maintenant vous connecter.
          </AppText>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
            <AppText style={styles.buttonText}>Se connecter</AppText>
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <AppText style={typography.title}>Créer un compte</AppText>

      <View style={styles.form}>
        <View style={styles.field}>
          <AppText style={styles.label}>Email</AppText>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="votre@email.com"
            placeholderTextColor={colors.lightGray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })) }}
          />
          {errors.email ? <AppText style={styles.errorText}>{errors.email}</AppText> : null}
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Mot de passe</AppText>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="Minimum 8 caractères"
            placeholderTextColor={colors.lightGray}
            secureTextEntry
            value={password}
            onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })) }}
          />
          {errors.password ? <AppText style={styles.errorText}>{errors.password}</AppText> : null}
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Confirmer le mot de passe</AppText>
          <TextInput
            style={[styles.input, errors.confirm ? styles.inputError : null]}
            placeholder="Répétez le mot de passe"
            placeholderTextColor={colors.lightGray}
            secureTextEntry
            value={confirm}
            onChangeText={t => { setConfirm(t); setErrors(e => ({ ...e, confirm: undefined })) }}
          />
          {errors.confirm ? <AppText style={styles.errorText}>{errors.confirm}</AppText> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <AppText style={styles.buttonText}>Créer mon compte</AppText>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <AppText style={styles.loginText}>Déjà un compte ? </AppText>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={styles.loginLink}>Se connecter</AppText>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    fontSize: 56,
    color: colors.green,
    fontWeight: '700' as const,
  },
  successMsg: {
    color: colors.white,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
})
