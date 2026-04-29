import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import AppText from './AppText'
import { colors } from '../constants/theme'

export const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  visiting: '#8B5CF6',
  offer: '#10B981',
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'En contact',
  visiting: 'Visite',
  offer: 'Offre',
}

type Lead = {
  id: string
  name: string
  property_id: string
  property_title?: string
  status: string
}

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/(app)/leads/${lead.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.avatar}>
        <AppText style={styles.avatarText}>{lead.name[0]}</AppText>
      </View>
      <View style={styles.info}>
        <AppText style={styles.name}>{lead.name}</AppText>
        <AppText style={styles.property}>{lead.property_title ?? `Bien #${lead.property_id}`}</AppText>
      </View>
      <View style={[styles.statut, { backgroundColor: STATUS_COLORS[lead.status] ?? '#9CA3AF' }]}>
        <AppText style={styles.statutText}>{STATUS_LABELS[lead.status] ?? lead.status}</AppText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.lightGray,
  },
  property: {
    fontSize: 15,
    color: colors.lightGray,
  },
  statut: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statutText: {
    color: '#fff',
    fontWeight: '600',
  },
})
