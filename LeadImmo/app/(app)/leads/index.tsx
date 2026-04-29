import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import LeadCard from '../../components/LeadCard'
import { getLeads, createLead } from '../../services/leads'
import { getProperties } from '../../services/properties'
import { STATUS_COLORS, STATUS_LABELS } from '../../components/LeadCard'
import { colors, spacing, radius } from '../../constants/theme'
import type { LeadStatus } from '../../types/lead'

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new',       label: 'Nouveau'    },
  { value: 'contacted', label: 'En contact' },
  { value: 'visiting',  label: 'Visite'     },
  { value: 'offer',     label: 'Offre'      },
]

type FormState = {
  name: string
  email: string
  phone: string
  status: LeadStatus
  budget: string
  notes: string
  property_id: string
}

const EMPTY_FORM: FormState = {
  name: '', email: '', phone: '', status: 'new', budget: '', notes: '', property_id: '',
}

export default function Leads() {
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const { data: leads = [], isLoading, isError, error } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  })

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const createMutation = useMutation({
    mutationFn: (data: FormState) =>
      createLead({
        ...data,
        property_id: data.property_id || null,
        budget: data.budget ? Number(data.budget) : undefined,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setCreating(false)
      setForm(EMPTY_FORM)
    },
  })

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.title}>Mes Leads</AppText>
        <TouchableOpacity style={styles.btnNew} onPress={() => setCreating(true)}>
          <AppText style={styles.btnNewText}>+ Nouveau</AppText>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator color={colors.white} style={{ marginTop: spacing.md }} />}

      {isError && (
        <AppText style={styles.error}>{(error as Error)?.message ?? 'Impossible de charger les leads.'}</AppText>
      )}

      <View style={styles.list}>
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </View>

      <Modal visible={creating} animationType="slide" onRequestClose={() => setCreating(false)}>
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <AppText style={styles.modalTitle}>Nouveau lead</AppText>

          <Field label="Nom"        value={form.name}   onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <Field label="Email"      value={form.email}  onChangeText={v => setForm(f => ({ ...f, email: v }))} keyboardType="email-address" />
          <Field label="Téléphone"  value={form.phone}  onChangeText={v => setForm(f => ({ ...f, phone: v }))} keyboardType="phone-pad" />
          <Field label="Budget (€)" value={form.budget} onChangeText={v => setForm(f => ({ ...f, budget: v }))} keyboardType="numeric" />
          <Field label="Notes"      value={form.notes}  onChangeText={v => setForm(f => ({ ...f, notes: v }))} multiline />

          <AppText style={styles.fieldLabel}>Statut</AppText>
          <View style={styles.chipRow}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.chip, form.status === s.value && { backgroundColor: STATUS_COLORS[s.value] }]}
                onPress={() => setForm(f => ({ ...f, status: s.value }))}
              >
                <AppText style={[styles.chipText, form.status === s.value && { color: colors.white }]}>
                  {STATUS_LABELS[s.value]}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <AppText style={styles.fieldLabel}>Bien associé</AppText>
          <View style={styles.propertyList}>
            {properties.map(p => {
              const selected = form.property_id === String(p.id)
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.propertyRow, selected && styles.propertyRowSelected]}
                  onPress={() => setForm(f => ({ ...f, property_id: String(p.id) }))}
                >
                  <View style={styles.propertyRowInner}>
                    <AppText style={[styles.propertyRowTitle, selected && { color: colors.blue }]} numberOfLines={1}>
                      {p.title}
                    </AppText>
                    <AppText style={styles.propertyRowAddress} numberOfLines={1}>{p.address}</AppText>
                  </View>
                  {selected && <View style={styles.checkDot} />}
                </TouchableOpacity>
              )
            })}
          </View>

          {createMutation.isError && (
            <AppText style={styles.errorText}>
              {(createMutation.error as Error)?.message ?? 'Erreur lors de la création.'}
            </AppText>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => { setCreating(false); setForm(EMPTY_FORM) }}>
              <AppText style={styles.btnCancelText}>Annuler</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSave, createMutation.isPending && styles.btnDisabled]}
              onPress={() => createMutation.mutate(form)}
              disabled={createMutation.isPending}
            >
              <AppText style={styles.btnSaveText}>
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </Screen>
  )
}

function Field({
  label, value, onChangeText, keyboardType, multiline,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'
  multiline?: boolean
}) {
  return (
    <View style={styles.fieldWrapper}>
      <AppText style={styles.fieldLabel}>{label}</AppText>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        multiline={multiline}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  title: { fontSize: 22, fontWeight: 'bold' },
  btnNew: { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  btnNewText: { color: colors.white, fontSize: 14, fontWeight: '600' as const },
  error: { color: colors.red, fontSize: 14, marginTop: spacing.sm },
  list: { marginTop: 20, gap: 12, width: '100%' },
  // Modal
  modal: { flex: 1, backgroundColor: '#F3F4F6' },
  modalContent: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.gray800, marginBottom: spacing.sm },
  fieldWrapper: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.xs },
  input: { backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.gray800, borderWidth: 1, borderColor: '#E5E7EB' },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: colors.white },
  chipText: { fontSize: 13, fontWeight: '500' as const, color: colors.gray800 },
  propertyList: { marginTop: 6, gap: 6 },
  propertyRow: { backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.sm, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center' },
  propertyRowSelected: { borderColor: colors.blue, borderWidth: 2 },
  propertyRowInner: { flex: 1 },
  propertyRowTitle: { fontSize: 14, fontWeight: '600' as const, color: colors.gray800 },
  propertyRowAddress: { fontSize: 12, color: colors.lightGray, marginTop: 2 },
  checkDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue, marginLeft: spacing.sm },
  errorText: { color: '#EF4444', fontSize: 13, marginTop: spacing.xs },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  btnCancel: { flex: 1, paddingVertical: 13, borderRadius: radius.sm, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', backgroundColor: colors.white },
  btnCancelText: { fontSize: 15, color: colors.gray800, fontWeight: '500' as const },
  btnSave: { flex: 1, paddingVertical: 13, borderRadius: radius.sm, alignItems: 'center', backgroundColor: colors.blue },
  btnSaveText: { fontSize: 15, color: colors.white, fontWeight: '600' as const },
  btnDisabled: { opacity: 0.5 },
})
