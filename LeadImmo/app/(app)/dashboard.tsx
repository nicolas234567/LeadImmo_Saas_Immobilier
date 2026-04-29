import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import LeadCard from '../components/LeadCard'
import { typography, colors, spacing } from '../constants/theme'
import { getLeads } from '../services/leads'
import { getProperties } from '../services/properties'

export default function Dashboard() {
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  })

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const isLoading = leadsLoading || propertiesLoading

  const kpis = {
    activeLeads: leads.length,
    availableProperties: properties.filter(p => p.status === 'available').length,
    visitsThisWeek: leads.filter(l => l.status === 'visiting').length,
    pendingOffers: leads.filter(l => l.status === 'offer').length,
  }

  const recentLeads = leads.slice(0, 5)

  return (
    <Screen>
      <AppText style={typography.title}>Dashboard</AppText>

      {isLoading && <ActivityIndicator color={colors.white} style={{ marginTop: spacing.md }} />}

      <View style={styles.kpis}>
        <View style={[styles.kpiItem, { backgroundColor: '#2196F3' }]}>
          <AppText style={styles.kpiValue}>{kpis.activeLeads}</AppText>
          <AppText style={styles.kpiText}>leads actifs</AppText>
        </View>
        <View style={[styles.kpiItem, { backgroundColor: '#4CAF50' }]}>
          <AppText style={styles.kpiValue}>{kpis.availableProperties}</AppText>
          <AppText style={styles.kpiText}>biens disponibles</AppText>
        </View>
        <View style={[styles.kpiItem, { backgroundColor: '#FF9800' }]}>
          <AppText style={styles.kpiValue}>{kpis.visitsThisWeek}</AppText>
          <AppText style={styles.kpiText}>visites en cours</AppText>
        </View>
        <View style={[styles.kpiItem, { backgroundColor: '#f44336' }]}>
          <AppText style={styles.kpiValue}>{kpis.pendingOffers}</AppText>
          <AppText style={styles.kpiText}>offres en cours</AppText>
        </View>
      </View>

      <View style={styles.section}>
        <AppText style={styles.texte}>Derniers leads :</AppText>
        <View style={styles.list}>
          {recentLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  kpis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  kpiItem: {
    width: '48%',
    height: 100,
    padding: 20,
    borderRadius: 12,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  kpiText: {
    fontSize: 18,
    color: '#fff',
  },
  section: {
    width: '100%',
  },
  texte: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignContent: 'flex-start',
  },
  list: {
    gap: 12,
    marginTop: 12,
  },
})
