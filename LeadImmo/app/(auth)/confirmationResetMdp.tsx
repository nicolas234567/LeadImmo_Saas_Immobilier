import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, typography, spacing } from '../constants/theme'
import Screen from '../components/Screen'
import AppText from '../components/AppText'

export default function ConfirmationResetMdp() {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText style={styles.icon}>✉</AppText>
        <AppText style={[typography.title, styles.title]}>Email envoyé !</AppText>
        <AppText style={styles.message}>
          Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception.
        </AppText>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
          <AppText style={styles.buttonText}>Retour à la connexion</AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 56,
    color: colors.blue,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.lightGray,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
})
