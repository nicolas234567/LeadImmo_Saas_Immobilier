import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import Field from '../../components/Field'
import { getLead, updateLead, deleteLead } from '../../services/leads'
import { getProperties } from '../../services/properties'
import { STATUS_COLORS, STATUS_LABELS } from '../../components/LeadCard'
import { colors, spacing, radius } from '../../constants/theme'
import { leadFormStyles as lf } from '../../styles/leadForm'
import { crossAlert } from '../../utils/alert'
import { STATUSES } from '../../types/lead'
import type { LeadStatus } from '../../types/lead'

function formatDate(iso: string) {
  const date = new Date(iso)
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

function formatBudget(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

type FormState = {
  name: string
  email: string
  phone: string
  status: LeadStatus
  budget: string
  notes: string
  property_id: string
}

export default function LeadDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['leads', id],
    queryFn: () => getLead(id),
  })

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormState) =>
      updateLead(id, {
        ...data,
        budget: data.budget ? Number(data.budget) : undefined,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      router.back()
    },
  })

  function openEdit() {
    if (!lead) return
    setForm({
      name:        lead.name,
      email:       lead.email,
      phone:       lead.phone,
      status:      lead.status,
      budget:      lead.budget ? String(lead.budget) : '',
      notes:       lead.notes ?? '',
      property_id: String(lead.property_id),
    })
    setEditing(true)
  }

  function handleDelete() {
    crossAlert('Supprimer ce lead ?', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ])
  }

  if (isLoading) {
    return <Screen><ActivityIndicator color={colors.white} /></Screen>
  }

  if (isError || !lead) {
    return (
      <Screen>
        <AppText style={{ color: colors.white, fontSize: 16 }}>Lead introuvable.</AppText>
      </Screen>
    )
  }

  const statusColor = STATUS_COLORS[lead.status] ?? '#9CA3AF'

  return (
    <Screen>
      <View style={styles.page}>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={styles.backText}>← Retour</AppText>
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.btnEdit} onPress={openEdit}>
              <AppText style={styles.btnEditText}>Modifier</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
              <AppText style={styles.btnDeleteText}>Supprimer</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>{lead.name[0]}</AppText>
          </View>
          <View style={styles.headerInfo}>
            <AppText style={styles.name}>{lead.name}</AppText>
            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <AppText style={styles.badgeText}>{STATUS_LABELS[lead.status] ?? lead.status}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Coordonnées</AppText>
          <Row label="Email"     value={lead.email} />
          <Row label="Téléphone" value={lead.phone} />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Bien concerné</AppText>
          <Row label="Bien" value={lead.property_title ?? `#${lead.property_id}`} />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Informations</AppText>
          <Row label="Budget"  value={lead.budget ? formatBudget(lead.budget) : '—'} />
          <Row label="Créé le" value={formatDate(lead.created_at)} />
        </View>

        {lead.notes ? (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Notes</AppText>
            <View style={styles.notesBox}>
              <AppText style={styles.notesText}>{lead.notes}</AppText>
            </View>
          </View>
        ) : null}

      </View>

      {form && (
        <Modal visible={editing} animationType="slide" onRequestClose={() => setEditing(false)}>
          <ScrollView style={lf.modal} contentContainerStyle={lf.modalContent} keyboardShouldPersistTaps="handled">
            <AppText style={lf.modalTitle}>Modifier le lead</AppText>

            <Field label="Nom"        value={form.name}   onChangeText={v => setForm(f => f && ({ ...f, name: v }))} />
            <Field label="Email"      value={form.email}  onChangeText={v => setForm(f => f && ({ ...f, email: v }))} keyboardType="email-address" />
            <Field label="Téléphone"  value={form.phone}  onChangeText={v => setForm(f => f && ({ ...f, phone: v }))} keyboardType="phone-pad" />
            <Field label="Budget (€)" value={form.budget} onChangeText={v => setForm(f => f && ({ ...f, budget: v }))} keyboardType="numeric" />
            <Field label="Notes"      value={form.notes}  onChangeText={v => setForm(f => f && ({ ...f, notes: v }))} multiline />

            <AppText style={lf.fieldLabel}>Statut</AppText>
            <View style={lf.chipRow}>
              {STATUSES.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[lf.chip, form.status === s.value && { backgroundColor: STATUS_COLORS[s.value] }]}
                  onPress={() => setForm(f => f && ({ ...f, status: s.value }))}
                >
                  <AppText style={[lf.chipText, form.status === s.value && { color: colors.white }]}>
                    {s.label}
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
                    onPress={() => setForm(f => f && ({ ...f, property_id: String(p.id) }))}
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

            {updateMutation.isError && (
              <AppText style={lf.errorText}>
                {(updateMutation.error as Error)?.message ?? 'Erreur lors de la mise à jour.'}
              </AppText>
            )}

            <View style={lf.modalActions}>
              <TouchableOpacity style={lf.btnCancel} onPress={() => setEditing(false)}>
                <AppText style={lf.btnCancelText}>Annuler</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[lf.btnSave, updateMutation.isPending && lf.btnDisabled]}
                onPress={() => form && updateMutation.mutate(form)}
                disabled={updateMutation.isPending}
              >
                <AppText style={lf.btnSaveText}>
                  {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      )}
    </Screen>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText style={styles.rowLabel}>{label}</AppText>
      <AppText style={styles.rowValue}>{value}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  page:         { width: '100%', gap: spacing.md },
  topBar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText:     { color: colors.blue, fontSize: 15, fontWeight: '500' as const },
  topActions:   { flexDirection: 'row', gap: spacing.sm },
  btnEdit:      { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm },
  btnEditText:  { color: colors.white, fontSize: 13, fontWeight: '600' as const },
  btnDelete:    { backgroundColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm },
  btnDeleteText:{ color: colors.white, fontSize: 13, fontWeight: '600' as const },
  header:       { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  avatar:       { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { color: colors.white, fontWeight: '700' as const, fontSize: 26 },
  headerInfo:   { gap: spacing.xs },
  name:         { fontSize: 22, fontWeight: '700' as const, color: colors.white },
  badge:        { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.sm },
  badgeText:    { color: colors.white, fontSize: 13, fontWeight: '600' as const },
  section:      { width: '100%', backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { fontSize: 13, fontWeight: '700' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.xs },
  row:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  rowLabel:     { fontSize: 14, color: colors.lightGray, width: 110 },
  rowValue:     { fontSize: 14, fontWeight: '500' as const, color: colors.gray800, flex: 1, textAlign: 'right' },
  notesBox:     { backgroundColor: colors.gray50, borderRadius: radius.sm, padding: spacing.sm },
  notesText:    { fontSize: 14, color: colors.gray800, lineHeight: 20 },
})
