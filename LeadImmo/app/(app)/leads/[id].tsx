import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { getLead } from '../../services/leads'
import { colors, spacing, radius } from '../../constants/theme'

const STATUS_COLORS: Record<string, string> = {
  nouveau: '#3B82F6',
  'En contact': '#F59E0B',
  visite: '#8B5CF6',
  offre: '#10B981',
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatBudget(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

export default function LeadDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const lead = getLead(id)

  if (!lead) {
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
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <AppText style={styles.backText}>← Retour</AppText>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>{lead.name[0]}</AppText>
          </View>
          <View style={styles.headerInfo}>
            <AppText style={styles.name}>{lead.name}</AppText>
            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <AppText style={styles.badgeText}>{lead.status}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Coordonnées</AppText>
          <Row label="Email" value={lead.email} />
          <Row label="Téléphone" value={lead.phone} />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Bien concerné</AppText>
          <Row label="Titre" value={lead.propertyTitle} />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Informations</AppText>
          <Row label="Source" value={lead.source ?? '—'} />
          <Row label="Budget" value={lead.budget ? formatBudget(lead.budget) : '—'} />
          <Row label="Créé le" value={formatDate(lead.createdAt)} />
          {lead.visitDate ? <Row label="Visite prévue" value={formatDate(lead.visitDate)} /> : null}
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
  page: {
    width: '100%',
    gap: spacing.md,
  },
  back: {
    marginBottom: spacing.xs,
  },
  backText: {
    color: colors.blue,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700' as const,
    fontSize: 26,
  },
  headerInfo: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.white,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  section: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.lightGray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.lightGray,
    width: 110,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.gray800,
    flex: 1,
    textAlign: 'right',
  },
  notesBox: {
    backgroundColor: colors.gray50,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  notesText: {
    fontSize: 14,
    color: colors.gray800,
    lineHeight: 20,
  },
})
