import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { getProperty } from '../../services/properties'
import { getLeads } from '../../services/leads'
import { colors, spacing, radius } from '../../constants/theme'

const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  under_offer: 'Sous offre',
  sold: 'Vendu',
}

const STATUS_COLORS: Record<string, string> = {
  available: colors.green,
  under_offer: colors.amber,
  sold: colors.red,
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  nouveau: '#3B82F6',
  'En contact': '#F59E0B',
  visite: '#8B5CF6',
  offre: '#10B981',
}

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const property = getProperty(id)

  if (!property) {
    return (
      <Screen>
        <AppText style={{ color: colors.white, fontSize: 16 }}>Bien introuvable.</AppText>
      </Screen>
    )
  }

  const statusColor = STATUS_COLORS[property.status] ?? colors.lightGray
  const statusLabel = STATUS_LABELS[property.status] ?? property.status
  const associatedLeads = getLeads().filter(l => l.propertyId === id)

  return (
    <Screen>
      <View style={styles.page}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <AppText style={styles.backText}>← Retour</AppText>
        </TouchableOpacity>

        {property.image ? (
          <Image source={property.image} style={styles.image} />
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
          <Row label="Prix" value={formatPrice(property.price)} />
          {property.surface ? <Row label="Surface" value={`${property.surface} m²`} /> : null}
          {property.rooms ? <Row label="Pièces" value={String(property.rooms)} /> : null}
          {property.type ? <Row label="Type" value={property.type} /> : null}
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
                  <AppText style={styles.leadBadgeText}>{lead.status}</AppText>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
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
  back: {},
  backText: {
    color: colors.blue,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    resizeMode: 'cover',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.white,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
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
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: colors.lightGray,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.gray800,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.gray800,
    lineHeight: 21,
  },
  noLeads: {
    fontSize: 14,
    color: colors.lightGray,
    fontStyle: 'italic',
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  leadAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadAvatarText: {
    color: colors.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.gray800,
  },
  leadContact: {
    fontSize: 12,
    color: colors.lightGray,
  },
  leadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  leadBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600' as const,
  },
})
