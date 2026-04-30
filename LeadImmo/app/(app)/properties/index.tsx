import { useState } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView, TextInput, Alert } from 'react-native'
import { router } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { getProperties, createProperty } from '../../services/properties'
import { colors, spacing, radius } from '../../constants/theme'
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
  { value: 'available',   label: 'Disponible' },
  { value: 'under_offer', label: 'Sous offre' },
  { value: 'sold',        label: 'Vendu'      },
]

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR') + ' €'
}

type PickedImage = { uri: string; mimeType: string; fileName: string }

type FormState = {
  title: string
  address: string
  price: string
  status: PropertyStatus
}

const EMPTY_FORM: FormState = { title: '', address: '', price: '', status: 'available' }

export default function Properties() {
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [pickedImage, setPickedImage] = useState<PickedImage | null>(null)

  const { data: properties = [], isLoading, isError, error } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const createMutation = useMutation({
    mutationFn: (data: FormState) =>
      createProperty(
        { title: data.title, address: data.address, price: Number(data.price), status: data.status },
        pickedImage ?? undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setCreating(false)
      setForm(EMPTY_FORM)
      setPickedImage(null)
    },
  })

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est requis.')
      return
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

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.title}>Mes Biens</AppText>
        <TouchableOpacity style={styles.btnNew} onPress={() => setCreating(true)}>
          <AppText style={styles.btnNewText}>+ Nouveau</AppText>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator color={colors.white} style={{ marginTop: spacing.md }} />}

      {isError && (
        <AppText style={styles.error}>{(error as Error)?.message ?? 'Impossible de charger les biens.'}</AppText>
      )}

      <View style={styles.list}>
        {properties.map(property => (
          <TouchableOpacity
            key={property.id}
            style={styles.card}
            onPress={() => router.push(`/(app)/properties/${property.id}`)}
            activeOpacity={0.8}
          >
            {property.image_mimetype ? (
              <Image
                source={{ uri: `${API_URL}/properties/${property.id}/image` }}
                style={styles.image}
              />
            ) : null}

            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[property.status] ?? colors.lightGray }]}>
                  <AppText style={styles.badgeText}>{STATUS_LABELS[property.status] ?? property.status}</AppText>
                </View>
              </View>

              <Text style={styles.address} numberOfLines={1}>{property.address}</Text>

              <View style={styles.footer}>
                <AppText style={styles.price}>{formatPrice(property.price)}</AppText>
                <AppText style={styles.leads}>{property.leadsCount} lead{property.leadsCount !== 1 ? 's' : ''}</AppText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={creating} animationType="slide" onRequestClose={() => setCreating(false)}>
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <AppText style={styles.modalTitle}>Nouveau bien</AppText>

          <Field label="Titre"    value={form.title}   onChangeText={v => setForm(f => ({ ...f, title: v }))} />
          <Field label="Adresse"  value={form.address} onChangeText={v => setForm(f => ({ ...f, address: v }))} />
          <Field label="Prix (€)" value={form.price}   onChangeText={v => setForm(f => ({ ...f, price: v }))} keyboardType="numeric" />

          <AppText style={styles.fieldLabel}>Statut</AppText>
          <View style={styles.chipRow}>
            {PROPERTY_STATUSES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.chip, form.status === s.value && { backgroundColor: STATUS_COLORS[s.value] }]}
                onPress={() => setForm(f => ({ ...f, status: s.value }))}
              >
                <AppText style={[styles.chipText, form.status === s.value && { color: colors.white }]}>
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
                <AppText style={styles.imagePlaceholderText}>📷  Ajouter une image</AppText>
              </View>
            )}
          </TouchableOpacity>
          {pickedImage && (
            <TouchableOpacity onPress={() => setPickedImage(null)}>
              <AppText style={styles.removeImage}>Retirer l'image</AppText>
            </TouchableOpacity>
          )}

          {createMutation.isError && (
            <AppText style={styles.errorText}>
              {(createMutation.error as Error)?.message ?? 'Erreur lors de la création.'}
            </AppText>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => { setCreating(false); setForm(EMPTY_FORM); setPickedImage(null) }}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  btnNew: { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  btnNewText: { color: colors.white, fontSize: 14, fontWeight: '600' as const },
  error: { color: colors.red, fontSize: 14, marginBottom: spacing.md },
  list: { gap: 14, width: '100%' },
  card: { backgroundColor: colors.white, borderRadius: radius.md, overflow: 'hidden' },
  image: { width: '100%', height: 170, resizeMode: 'cover' },
  body: { padding: spacing.md, gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  propertyTitle: { fontSize: 16, fontWeight: '700', color: colors.gray800, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  address: { fontSize: 13, color: colors.lightGray },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  price: { fontSize: 16, fontWeight: '700', color: colors.blue },
  leads: { fontSize: 13, color: colors.lightGray },
  // Modal
  modal: { flex: 1, backgroundColor: '#F3F4F6' },
  modalContent: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700' as const, color: colors.gray800, marginBottom: spacing.sm },
  fieldWrapper: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600' as const, color: colors.lightGray, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.xs },
  input: { backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.gray800, borderWidth: 1, borderColor: '#E5E7EB' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: colors.white },
  chipText: { fontSize: 13, fontWeight: '500' as const, color: colors.gray800 },
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
