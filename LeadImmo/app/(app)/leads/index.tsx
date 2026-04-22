import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { getLeads } from '../../services/leads'
import { colors } from '../../constants/theme'

const STATUS_COLORS: Record<string, string> = {
  nouveau: '#3B82F6',
  'En contact': '#F59E0B',
  visite: '#8B5CF6',
  offre: '#10B981',
}

export default function Leads() {
  const leads = getLeads()

  return (
    <Screen>
      <AppText style={styles.title}>Mes Leads</AppText>

      <View style={styles.list}>
        {leads.map(lead => (
          <TouchableOpacity
            key={lead.id}
            style={styles.row}
            onPress={() => router.push(`/(app)/leads/${lead.id}`)}
            activeOpacity={0.75}
          >
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>{lead.name[0]}</AppText>
            </View>
            <View style={styles.info}>
              <AppText style={styles.name}>{lead.name}</AppText>
              <AppText style={styles.property}>{lead.propertyTitle}</AppText>
            </View>
            <View style={[styles.statut, { backgroundColor: STATUS_COLORS[lead.status] ?? '#9CA3AF' }]}>
              <AppText style={styles.statutText}>{lead.status}</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
    gap: 12,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingHorizontal: 20,
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
