import { StyleSheet } from 'react-native'
import { colors, spacing, radius } from '../constants/theme'

export const leadFormStyles = StyleSheet.create({
  modal:               { flex: 1, backgroundColor: '#F3F4F6' },
  modalContent:        { padding: spacing.lg, gap: spacing.sm, paddingBottom: 60 },
  modalTitle:          { fontSize: 20, fontWeight: '700' as const, color: colors.gray800, marginBottom: spacing.sm },
  fieldWrapper:        { gap: 4 },
  fieldLabel:          { fontSize: 13, fontWeight: '600' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.xs },
  input:               { backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.gray800, borderWidth: 1, borderColor: '#E5E7EB' },
  inputMultiline:      { minHeight: 90, textAlignVertical: 'top' as const },
  chipRow:             { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip:                { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: colors.white },
  chipText:            { fontSize: 13, fontWeight: '500' as const, color: colors.gray800 },
  propertyList:        { marginTop: 6, gap: 6 },
  propertyRow:         { backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.sm, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
  propertyRowSelected: { borderColor: colors.blue, borderWidth: 2 },
  propertyRowInner:    { flex: 1 },
  propertyRowTitle:    { fontSize: 14, fontWeight: '600' as const, color: colors.gray800 },
  propertyRowAddress:  { fontSize: 12, color: colors.lightGray, marginTop: 2 },
  checkDot:            { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue, marginLeft: spacing.sm },
  errorText:           { color: '#EF4444', fontSize: 13, marginTop: spacing.xs },
  modalActions:        { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  btnCancel:           { flex: 1, paddingVertical: 13, borderRadius: radius.sm, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', backgroundColor: colors.white },
  btnCancelText:       { fontSize: 15, color: colors.gray800, fontWeight: '500' as const },
  btnSave:             { flex: 1, paddingVertical: 13, borderRadius: radius.sm, alignItems: 'center', backgroundColor: colors.blue },
  btnSaveText:         { fontSize: 15, color: colors.white, fontWeight: '600' as const },
  btnDisabled:         { opacity: 0.5 },
})
