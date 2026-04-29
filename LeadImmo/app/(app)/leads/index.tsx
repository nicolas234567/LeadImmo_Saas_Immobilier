import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import LeadCard from '../../components/LeadCard'
import Field from '../../components/Field'
import { getLeads, createLead } from '../../services/leads'
import { getProperties } from '../../services/properties'
import { STATUS_COLORS, STATUS_LABELS } from '../../components/LeadCard'
import { colors, spacing, radius } from '../../constants/theme'
import { leadFormStyles as lf } from '../../styles/leadForm'
import { STATUSES } from '../../types/lead'
import type { LeadStatus } from '../../types/lead'

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
        <ScrollView style={lf.modal} contentContainerStyle={lf.modalContent} keyboardShouldPersistTaps="handled">
          <AppText style={lf.modalTitle}>Nouveau lead</AppText>

          <Field label="Nom"        value={form.name}   onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <Field label="Email"      value={form.email}  onChangeText={v => setForm(f => ({ ...f, email: v }))} keyboardType="email-address" />
          <Field label="Téléphone"  value={form.phone}  onChangeText={v => setForm(f => ({ ...f, phone: v }))} keyboardType="phone-pad" />
          <Field label="Budget (€)" value={form.budget} onChangeText={v => setForm(f => ({ ...f, budget: v }))} keyboardType="numeric" />
          <Field label="Notes"      value={form.notes}  onChangeText={v => setForm(f => ({ ...f, notes: v }))} multiline />

          <AppText style={lf.fieldLabel}>Statut</AppText>
          <View style={lf.chipRow}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[lf.chip, form.status === s.value && { backgroundColor: STATUS_COLORS[s.value] }]}
                onPress={() => setForm(f => ({ ...f, status: s.value }))}
              >
                <AppText style={[lf.chipText, form.status === s.value && { color: colors.white }]}>
                  {STATUS_LABELS[s.value]}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <AppText style={lf.fieldLabel}>Bien associé</AppText>
          <View style={lf.propertyList}>
            {properties.map(p => {
              const selected = form.property_id === String(p.id)
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[lf.propertyRow, selected && lf.propertyRowSelected]}
                  onPress={() => setForm(f => ({ ...f, property_id: String(p.id) }))}
                >
                  <View style={lf.propertyRowInner}>
                    <AppText style={[lf.propertyRowTitle, selected && { color: colors.blue }]} numberOfLines={1}>
                      {p.title}
                    </AppText>
                    <AppText style={lf.propertyRowAddress} numberOfLines={1}>{p.address}</AppText>
                  </View>
                  {selected && <View style={lf.checkDot} />}
                </TouchableOpacity>
              )
            })}
          </View>

          {createMutation.isError && (
            <AppText style={lf.errorText}>
              {(createMutation.error as Error)?.message ?? 'Erreur lors de la création.'}
            </AppText>
          )}

          <View style={lf.modalActions}>
            <TouchableOpacity style={lf.btnCancel} onPress={() => { setCreating(false); setForm(EMPTY_FORM) }}>
              <AppText style={lf.btnCancelText}>Annuler</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[lf.btnSave, createMutation.isPending && lf.btnDisabled]}
              onPress={() => createMutation.mutate(form)}
              disabled={createMutation.isPending}
            >
              <AppText style={lf.btnSaveText}>
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  title:      { fontSize: 22, fontWeight: 'bold' },
  btnNew:     { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  btnNewText: { color: colors.white, fontSize: 14, fontWeight: '600' as const },
  error:      { color: colors.red, fontSize: 14, marginTop: spacing.sm },
  list:       { marginTop: 20, gap: 12, width: '100%' },
})
