import { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import { login, saveToken } from '../services/auth'

type FormErrors = { email?: string; password?: string }

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!email) e.email = 'Email requis'
    if (!password) e.password = 'Mot de passe requis'
    return e
  }

  async function handleSubmit() {
    // verifier que les champs sont remplis
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setLoading(true)
    setApiError(null)

    try {
      const token = await login(email, password)
      await saveToken(token)
      router.push('/(app)/dashboard')
    } catch (err: any) {
      setApiError(err.message ?? 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <AppText style={typography.title}>Connexion</AppText>

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
            placeholder="Votre mot de passe"
            placeholderTextColor={colors.lightGray}
            secureTextEntry
            value={password}
            onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })) }}
          />
          {errors.password ? <AppText style={styles.errorText}>{errors.password}</AppText> : null}
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/resetMdp')}>
          <AppText style={styles.forgotLink}>Mot de passe oublié ?</AppText>
        </TouchableOpacity>

        {apiError ? <AppText style={styles.errorText}>{apiError}</AppText> : null}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          <AppText style={styles.buttonText}>{loading ? 'Connexion…' : 'Se connecter'}</AppText>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <AppText style={styles.registerText}>Pas encore de compte ? </AppText>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <AppText style={styles.registerLink}>Créer un compte</AppText>
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
  forgotLink: {
    color: colors.lightGray,
    fontSize: 13,
    textAlign: 'right',
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.lightGray,
    fontSize: 14,
  },
  registerLink: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '600' as const,
  },
})
