import { useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView, TextInput, Platform } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { getProperty, updateProperty, deleteProperty } from '../../services/properties'
import { getLeads } from '../../services/leads'
import { STATUS_COLORS as LEAD_STATUS_COLORS, STATUS_LABELS as LEAD_STATUS_LABELS } from '../../components/LeadCard'
import { colors, spacing, radius } from '../../constants/theme'
import { crossAlert } from '../../utils/alert'
import { API_URL } from '../../constants/api'
import type { PropertyStatus } from '../../types/property'

const STATUS_LABELS: Record<string, string> = {
  available:   'Disponible',
  under_offer: 'Sous offre',
  sold:        'Vendu',
}

const STATUS_COLORS: Record<string, string> = {
  available:   colors.green,
  under_offer: colors.amber,
  sold:        colors.red,
}

const PROPERTY_STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: 'available',   label: 'Disponible'  },
  { value: 'under_offer', label: 'Sous offre'  },
  { value: 'sold',        label: 'Vendu'       },
]

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

type PickedImage = { uri: string; mimeType: string; fileName: string }

type FormState = {
  title: string
  address: string
  price: string
  status: PropertyStatus
}

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)
  const [pickedImage, setPickedImage] = useState<PickedImage | null>(null)

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => getProperty(id),
  })

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormState) =>
      updateProperty(
        id,
        { title: data.title, address: data.address, price: Number(data.price), status: data.status },
        pickedImage ?? undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setEditing(false)
      setPickedImage(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      router.back()
    },
  })

  function openEdit() {
    if (!property) return
    setForm({
      title:   property.title,
      address: property.address,
      price:   String(property.price),
      status:  property.status,
    })
    setPickedImage(null)
    setEditing(true)
  }

  async function pickImage() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        crossAlert('Permission refusée', "L'accès à la galerie est requis pour changer l'image.")
        return
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      setPickedImage({
        uri:      asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? `image_${Date.now()}.jpg`,
      })
    }
  }

  function handleDelete() {
    crossAlert('Supprimer ce bien ?', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ])
  }

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.white} style={{ marginTop: spacing.md }} />
      </Screen>
    )
  }

  if (isError || !property) {
    return (
      <Screen>
        <TouchableOpacity onPress={() => router.back()}>
          <AppText style={styles.backText}>← Retour</AppText>
        </TouchableOpacity>
        <AppText style={{ color: colors.white, fontSize: 16 }}>Bien introuvable.</AppText>
      </Screen>
    )
  }

  const statusColor = STATUS_COLORS[property.status] ?? colors.lightGray
  const statusLabel = STATUS_LABELS[property.status] ?? property.status
  const associatedLeads = leads.filter(l => String(l.property_id) === String(id))
  const imageUri = `${API_URL}/properties/${id}/image`

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

        {property.image_mimetype ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : null}

        <View style={styles.titleRow}>
          <AppText style={styles.title} numberOfLines={2}>{property.title}</AppText>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <AppText style={styles.badgeText}>{statusLabel}</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Détails</AppText>
          <Row label="Adresse" value={property.address} />
          <Row label="Prix"    value={formatPrice(property.price)} />
          {property.surface ? <Row label="Surface" value={`${property.surface} m²`} /> : null}
          {property.rooms   ? <Row label="Pièces"  value={String(property.rooms)}   /> : null}
          {property.type    ? <Row label="Type"    value={property.type}             /> : null}
        </View>

        {property.description ? (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Description</AppText>
            <AppText style={styles.descriptionText}>{property.description}</AppText>
          </View>
        ) : null}

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Leads ({associatedLeads.length})</AppText>
          {associatedLeads.length === 0 ? (
            <AppText style={styles.noLeads}>Aucun lead pour ce bien.</AppText>
          ) : (
            associatedLeads.map(lead => (
              <TouchableOpacity
                key={lead.id}
                style={styles.leadRow}
                onPress={() => router.push(`/(app)/leads/${lead.id}`)}
              >
                <View style={styles.leadAvatar}>
                  <AppText style={styles.leadAvatarText}>{lead.name[0]}</AppText>
                </View>
                <View style={styles.leadInfo}>
                  <AppText style={styles.leadName}>{lead.name}</AppText>
                  <AppText style={styles.leadContact}>{lead.phone}</AppText>
                </View>
                <View style={[styles.leadBadge, { backgroundColor: LEAD_STATUS_COLORS[lead.status] ?? '#9CA3AF' }]}>
                  <AppText style={styles.leadBadgeText}>{LEAD_STATUS_LABELS[lead.status] ?? lead.status}</AppText>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </View>

      {/* ── Modale d'édition ── */}
      {form && (
        <Modal visible={editing} animationType="slide" onRequestClose={() => setEditing(false)}>
          <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <AppText style={styles.modalTitle}>Modifier le bien</AppText>

            <Field label="Titre"    value={form.title}   onChangeText={v => setForm(f => f && ({ ...f, title: v }))} />
            <Field label="Adresse"  value={form.address} onChangeText={v => setForm(f => f && ({ ...f, address: v }))} />
            <Field label="Prix (€)" value={form.price}   onChangeText={v => setForm(f => f && ({ ...f, price: v }))} keyboardType="numeric" />

            <AppText style={styles.fieldLabel}>Statut</AppText>
            <View style={styles.statusRow}>
              {PROPERTY_STATUSES.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.statusChip, form.status === s.value && { backgroundColor: STATUS_COLORS[s.value] }]}
                  onPress={() => setForm(f => f && ({ ...f, status: s.value }))}
                >
                  <AppText style={[styles.statusChipText, form.status === s.value && { color: colors.white }]}>
                    {s.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <AppText style={styles.fieldLabel}>Image</AppText>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {pickedImage ? (
                <Image source={{ uri: pickedImage.uri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <AppText style={styles.imagePlaceholderText}>
                    {property.image_mimetype ? '🖼  Changer l\'image' : '📷  Ajouter une image'}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
            {pickedImage && (
              <TouchableOpacity onPress={() => setPickedImage(null)}>
                <AppText style={styles.removeImage}>Retirer l'image</AppText>
              </TouchableOpacity>
            )}

            {updateMutation.isError && (
              <AppText style={styles.errorText}>
                {(updateMutation.error as Error)?.message ?? 'Erreur lors de la mise à jour.'}
              </AppText>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setEditing(false)}>
                <AppText style={styles.btnCancelText}>Annuler</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSave, updateMutation.isPending && styles.btnDisabled]}
                onPress={() => form && updateMutation.mutate(form)}
                disabled={updateMutation.isPending}
              >
                <AppText style={styles.btnSaveText}>
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

function Field({
  label, value, onChangeText, keyboardType,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  keyboardType?: 'default' | 'numeric'
}) {
  return (
    <View style={styles.fieldWrapper}>
      <AppText style={styles.fieldLabel}>{label}</AppText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: { width: '100%', gap: spacing.md },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { color: colors.blue, fontSize: 15, fontWeight: '500' as const },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  btnEdit: { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm },
  btnEditText: { color: colors.white, fontSize: 13, fontWeight: '600' as const },
  btnDelete: { backgroundColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.sm },
  btnDeleteText: { color: colors.white, fontSize: 13, fontWeight: '600' as const },
  image: { width: '100%', height: 200, borderRadius: radius.md, resizeMode: 'cover' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  title: { fontSize: 20, fontWeight: '700' as const, color: colors.white, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, alignSelf: 'flex-start' },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' as const },
  section: { width: '100%', backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { fontSize: 13, fontWeight: '700' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: colors.lightGray },
  rowValue: { fontSize: 14, fontWeight: '600' as const, color: colors.gray800 },
  descriptionText: { fontSize: 14, color: colors.gray800, lineHeight: 21 },
  noLeads: { fontSize: 14, color: colors.lightGray, fontStyle: 'italic' },
  leadRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, borderTopWidth: 1, borderTopColor: colors.gray200 },
  leadAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  leadAvatarText: { color: colors.white, fontWeight: '700' as const, fontSize: 16 },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 14, fontWeight: '600' as const, color: colors.gray800 },
  leadContact: { fontSize: 12, color: colors.lightGray },
  leadBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm },
  leadBadgeText: { color: colors.white, fontSize: 11, fontWeight: '600' as const },
  // Modal
  modal: { flex: 1, backgroundColor: '#F3F4F6' },
  modalContent: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.gray800, marginBottom: spacing.sm },
  fieldWrapper: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.xs },
  input: { backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.gray800, borderWidth: 1, borderColor: '#E5E7EB' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  statusChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: colors.white },
  statusChipText: { fontSize: 13, fontWeight: '500' as const, color: colors.gray800 },
  imagePicker: { marginTop: 6, borderRadius: radius.sm, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 180, resizeMode: 'cover', borderRadius: radius.sm },
  imagePlaceholder: { width: '100%', height: 100, borderWidth: 1.5, borderColor: '#D1D5DB', borderStyle: 'dashed', borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  imagePlaceholderText: { fontSize: 14, color: colors.lightGray },
  removeImage: { fontSize: 13, color: '#EF4444', marginTop: 6 },
  errorText: { color: '#EF4444', fontSize: 13, marginTop: spacing.xs },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  btnCancel: { flex: 1, paddingVertical: 13, borderRadius: radius.sm, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', backgroundColor: colors.white },
  btnCancelText: { fontSize: 15, color: colors.gray800, fontWeight: '500' as const },
  btnSave: { flex: 1, paddingVertical: 13, borderRadius: radius.sm, alignItems: 'center', backgroundColor: colors.blue },
  btnSaveText: { fontSize: 15, color: colors.white, fontWeight: '600' as const },
  btnDisabled: { opacity: 0.5 },
})
