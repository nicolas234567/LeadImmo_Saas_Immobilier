import { View, TextInput } from 'react-native'
import AppText from './AppText'
import { leadFormStyles as s } from '../styles/leadForm'

export default function Field({
  label, value, onChangeText, keyboardType, multiline, secureTextEntry,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'
  multiline?: boolean
  secureTextEntry?: boolean
}) {
  return (
    <View style={s.fieldWrapper}>
      <AppText style={s.fieldLabel}>{label}</AppText>
      <TextInput
        style={[s.input, multiline && s.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        multiline={multiline}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}
