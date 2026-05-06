import { useState } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import Field from '../components/Field'
import { getAccounts, createAgencyAccount, updateAccount, deleteAccount } from '../services/accounts'
import { colors, spacing, radius } from '../constants/theme'
import { crossAlert } from '../utils/alert'
import { leadFormStyles as lf } from '../styles/leadForm'
import type { Account } from '../types/account'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Settings() {
  const queryClient = useQueryClient()

  const [creating, setCreating]     = useState(false)
  const [editing, setEditing]       = useState<Account | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [editEmail, setEditEmail] = useState('')

  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError]         = useState<string | null>(null)

  const { data: accounts = [], isLoading, isError, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  const createMutation = useMutation({
    mutationFn: () => createAgencyAccount(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setCreating(false)
      setEmail(''); setPassword(''); setConfirm('')
      setApiError(null)
    },
    onError: (err: Error) => setApiError(err.message ?? 'Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateAccount(editing!.id, editEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setEditing(null)
      setApiError(null)
    },
    onError: (err: Error) => setApiError(err.message ?? 'Erreur lors de la modification'),
  })

  function validateCreate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!email)                          e.email    = 'Email requis'
    else if (!isValidEmail(email))       e.email    = 'Format invalide'
    if (!password)                       e.password = 'Mot de passe requis'
    else if (password.length < 8)        e.password = 'Minimum 8 caractères'
    if (!confirm)                        e.confirm  = 'Confirmation requise'
    else if (confirm !== password)       e.confirm  = 'Les mots de passe ne correspondent pas'
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
    setEditEmail(account.email)
    setApiError(null)
  }

  function handleUpdate() {
    if (!editEmail || !isValidEmail(editEmail)) {
      setApiError('Email invalide')
      return
    }
    setApiError(null)
    updateMutation.mutate()
  }

  function confirmDelete(account: Account) {
    crossAlert(
      'Supprimer le compte',
      `Supprimer le compte ${account.email} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(account.id)
            try {
              await deleteAccount(account.id)
              queryClient.invalidateQueries({ queryKey: ['accounts'] })
            } catch (err) {
              crossAlert('Erreur', (err as Error).message ?? 'Impossible de supprimer le compte')
            } finally {
              setDeletingId(null)
            }
          },
        },
      ]
    )
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.title}>Paramètres</AppText>
        <TouchableOpacity
          style={styles.btnNew}
          onPress={() => { setCreating(true); setApiError(null); setCreateErrors({}) }}
        >
          <AppText style={styles.btnNewText}>+ Nouveau</AppText>
        </TouchableOpacity>
      </View>

      <AppText style={styles.sectionLabel}>Comptes de l'agence</AppText>

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
                style={[styles.btnDelete, deletingId === account.id && { opacity: 0.5 }]}
                onPress={() => confirmDelete(account)}
                disabled={deletingId === account.id}
              >
                <AppText style={styles.btnDeleteText}>
                  {deletingId === account.id ? '...' : 'Supprimer'}
                </AppText>
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
            value={email}
            onChangeText={v => { setEmail(v); setCreateErrors(e => ({ ...e, email: '' })) }}
            keyboardType="email-address"
          />
          {createErrors.email ? <AppText style={lf.errorText}>{createErrors.email}</AppText> : null}

          <Field
            label="Mot de passe"
            value={password}
            onChangeText={v => { setPassword(v); setCreateErrors(e => ({ ...e, password: '' })) }}
            secureTextEntry
          />
          {createErrors.password ? <AppText style={lf.errorText}>{createErrors.password}</AppText> : null}

          <Field
            label="Confirmer le mot de passe"
            value={confirm}
            onChangeText={v => { setConfirm(v); setCreateErrors(e => ({ ...e, confirm: '' })) }}
            secureTextEntry
          />
          {createErrors.confirm ? <AppText style={lf.errorText}>{createErrors.confirm}</AppText> : null}

          {apiError ? <AppText style={lf.errorText}>{apiError}</AppText> : null}

          <View style={lf.modalActions}>
            <TouchableOpacity
              style={lf.btnCancel}
              onPress={() => { setCreating(false); setEmail(''); setPassword(''); setConfirm(''); setCreateErrors({}) }}
            >
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
            value={editEmail}
            onChangeText={v => { setEditEmail(v); setApiError(null) }}
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
