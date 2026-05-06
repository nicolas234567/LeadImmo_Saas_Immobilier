import { Alert, Platform } from 'react-native'

type AlertButton = { text: string; style?: 'cancel' | 'destructive' | 'default'; onPress?: () => void }

export function crossAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS === 'web') {
    if (!buttons || buttons.length <= 1) {
      window.alert(message ? `${title}\n${message}` : title)
      buttons?.[0]?.onPress?.()
    } else {
      const confirmBtn = buttons.find(b => b.style !== 'cancel')
      const ok = window.confirm(message ? `${title}\n${message}` : title)
      if (ok) confirmBtn?.onPress?.()
    }
  } else {
    Alert.alert(title, message, buttons)
  }
}
