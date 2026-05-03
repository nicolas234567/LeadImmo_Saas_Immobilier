import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import Field from '../components/Field'
import { getAccounts, createAgencyAccount, updateAccount, deleteAccount } from '../services/accounts'
import { colors, spacing, radius } from '../constants/theme'
import { leadFormStyles as lf } from '../styles/leadForm'
import type { Account } from '../types/account'

type CreateForm = { email: string; password: string; confirm: string }
type EditForm   = { email: string }

const EMPTY_CREATE: CreateForm = { email: '', password: '', confirm: '' }
const EMPTY_EDIT:   EditForm   = { email: '' }

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Settings() {
  const queryClient = useQueryClient()
  const [creating, setCreating]   = useState(false)
  const [editing, setEditing]     = useState<Account | null>(null)
  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_CREATE)
  const [editForm, setEditForm]   = useState<EditForm>(EMPTY_EDIT)
  const [createErrors, setCreateErrors] = useState<Partial<CreateForm>>({})
  const [apiError, setApiError]   = useState<string | null>(null)

  const { data: accounts = [], isLoading, isError, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  const createMutation = useMutation({
    mutationFn: () => createAgencyAccount(createForm.email, createForm.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setCreating(false)
      setCreateForm(EMPTY_CREATE)
      setApiError(null)
    },
    onError: (err: Error) => setApiError(err.message ?? 'Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateAccount(editing!.id, editForm.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setEditing(null)
      setApiError(null)
    },
    onError: (err: Error) => setApiError(err.message ?? 'Erreur lors de la modification'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
    onError: (err: Error) => setApiError(err.message ?? 'Erreur lors de la suppression'),
  })

  function validateCreate(): Partial<CreateForm> {
    const e: Partial<CreateForm> = {}
    if (!createForm.email) e.email = 'Email requis'
    else if (!isValidEmail(createForm.email)) e.email = 'Format invalide'
    if (!createForm.password) e.password = 'Mot de passe requis'
    else if (createForm.password.length < 8) e.password = 'Minimum 8 caractères'
    if (!createForm.confirm) e.confirm = 'Confirmation requise'
    else if (createForm.confirm !== createForm.password) e.confirm = 'Les mots de passe ne correspondent pas'
    return e
  }

  function handleCreate() {
    const e = validateCreate()
    setCreateErrors(e)
    if (Object.keys(e).length > 0) return
    setApiError(null)
    createMutation.mutate()
  }

  function openEdit(account: Account) {
    setEditing(account)
    setEditForm({ email: account.email })
    setApiError(null)
  }

  function handleUpdate() {
    if (!editForm.email || !isValidEmail(editForm.email)) return
    setApiError(null)
    updateMutation.mutate()
  }

  function confirmDelete(account: Account) {
    setApiError(null)
    Alert.alert(
      'Supprimer le compte',
      `Supprimer le compte ${account.email} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(account.id) },
      ]
    )
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.title}>Paramètres</AppText>
        <TouchableOpacity style={styles.btnNew} onPress={() => { setCreating(true); setApiError(null) }}>
          <AppText style={styles.btnNewText}>+ Nouveau</AppText>
        </TouchableOpacity>
      </View>

      <AppText style={styles.sectionLabel}>Comptes de l'agence</AppText>

      {apiError && !creating && !editing && (
        <AppText style={styles.error}>{apiError}</AppText>
      )}

      {isLoading && <ActivityIndicator color={colors.white} style={{ marginTop: spacing.md }} />}

      {isError && (
        <AppText style={styles.error}>{(error as Error)?.message ?? 'Impossible de charger les comptes.'}</AppText>
      )}

      <View style={styles.list}>
        {accounts.map(account => (
          <View key={account.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <AppText style={styles.cardEmail}>{account.email}</AppText>
              <AppText style={styles.cardDate}>
                {new Date(account.created_at).toLocaleDateString('fr-FR')}
              </AppText>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.btnEdit} onPress={() => openEdit(account)}>
                <AppText style={styles.btnEditText}>Modifier</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnDelete, deleteMutation.isPending && { opacity: 0.5 }]}
                onPress={() => confirmDelete(account)}
                disabled={deleteMutation.isPending}
              >
                <AppText style={styles.btnDeleteText}>Supprimer</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Modal création */}
      <Modal visible={creating} animationType="slide" onRequestClose={() => setCreating(false)}>
        <ScrollView style={lf.modal} contentContainerStyle={lf.modalContent} keyboardShouldPersistTaps="handled">
          <AppText style={lf.modalTitle}>Nouveau compte</AppText>

          <Field
            label="Email"
            value={createForm.email}
            onChangeText={v => { setCreateForm(f => ({ ...f, email: v })); setCreateErrors(e => ({ ...e, email: undefined })) }}
            keyboardType="email-address"
          />
          {createErrors.email ? <AppText style={lf.errorText}>{createErrors.email}</AppText> : null}

          <Field
            label="Mot de passe"
            value={createForm.password}
            onChangeText={v => { setCreateForm(f => ({ ...f, password: v })); setCreateErrors(e => ({ ...e, password: undefined })) }}
            secureTextEntry
          />
          {createErrors.password ? <AppText style={lf.errorText}>{createErrors.password}</AppText> : null}

          <Field
            label="Confirmer le mot de passe"
            value={createForm.confirm}
            onChangeText={v => { setCreateForm(f => ({ ...f, confirm: v })); setCreateErrors(e => ({ ...e, confirm: undefined })) }}
            secureTextEntry
          />
          {createErrors.confirm ? <AppText style={lf.errorText}>{createErrors.confirm}</AppText> : null}

          {apiError ? <AppText style={lf.errorText}>{apiError}</AppText> : null}

          <View style={lf.modalActions}>
            <TouchableOpacity style={lf.btnCancel} onPress={() => { setCreating(false); setCreateForm(EMPTY_CREATE); setCreateErrors({}) }}>
              <AppText style={lf.btnCancelText}>Annuler</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[lf.btnSave, createMutation.isPending && lf.btnDisabled]}
              onPress={handleCreate}
              disabled={createMutation.isPending}
            >
              <AppText style={lf.btnSaveText}>
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Modal édition */}
      <Modal visible={!!editing} animationType="slide" onRequestClose={() => setEditing(null)}>
        <ScrollView style={lf.modal} contentContainerStyle={lf.modalContent} keyboardShouldPersistTaps="handled">
          <AppText style={lf.modalTitle}>Modifier le compte</AppText>

          <Field
            label="Email"
            value={editForm.email}
            onChangeText={v => setEditForm({ email: v })}
            keyboardType="email-address"
          />

          {apiError ? <AppText style={lf.errorText}>{apiError}</AppText> : null}

          <View style={lf.modalActions}>
            <TouchableOpacity style={lf.btnCancel} onPress={() => { setEditing(null); setApiError(null) }}>
              <AppText style={lf.btnCancelText}>Annuler</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[lf.btnSave, updateMutation.isPending && lf.btnDisabled]}
              onPress={handleUpdate}
              disabled={updateMutation.isPending}
            >
              <AppText style={lf.btnSaveText}>
                {updateMutation.isPending ? 'Modification...' : 'Enregistrer'}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  title:         { fontSize: 22, fontWeight: 'bold' as const, color: '#fff' },
  btnNew:        { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm },
  btnNewText:    { color: colors.white, fontSize: 14, fontWeight: '600' as const },
  sectionLabel:  { color: colors.lightGray, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: spacing.lg, marginBottom: spacing.sm },
  error:         { color: colors.red, fontSize: 14, marginTop: spacing.sm },
  list:          { gap: 10, width: '100%' },
  card:          { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  cardInfo:      { gap: 2 },
  cardEmail:     { color: colors.white, fontSize: 15, fontWeight: '600' as const },
  cardDate:      { color: colors.lightGray, fontSize: 12 },
  cardActions:   { flexDirection: 'row', gap: spacing.sm },
  btnEdit:       { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center', backgroundColor: colors.blue },
  btnEditText:   { color: colors.white, fontSize: 13, fontWeight: '600' as const },
  btnDelete:     { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center', backgroundColor: colors.red },
  btnDeleteText: { color: colors.white, fontSize: 13, fontWeight: '600' as const },
})
