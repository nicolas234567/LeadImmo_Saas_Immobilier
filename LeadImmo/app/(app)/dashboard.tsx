import { View, StyleSheet } from 'react-native'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import LeadCard from '../components/LeadCard'
import { typography } from '../constants/theme'
import { mockKpis, mockLeads } from '../constants/mockData'

export default function Dashboard() {
  return (
    <Screen>
      <AppText style={typography.title}>Dashboard</AppText>
      <View style={styles.kpis}>
          <View style={[styles.kpiItem, { backgroundColor: '#2196F3' }]}>
            <AppText style={styles.kpiValue}>{mockKpis.activeLeads}</AppText>
            <AppText style={styles.kpiText}>leads actifs</AppText>
          </View>
          <View style={[styles.kpiItem, { backgroundColor:  '#4CAF50' }]}>
            <AppText style={styles.kpiValue}>{mockKpis.availableProperties}</AppText>
            <AppText style={styles.kpiText}>biens disponibles</AppText>
          </View>
          <View style={[styles.kpiItem, { backgroundColor: '#FF9800' }]}>
            <AppText style={styles.kpiValue}>{mockKpis.visitsThisWeek}</AppText>
            <AppText style={styles.kpiText}>visites / semaine</AppText>
          </View>
          <View style={[styles.kpiItem, { backgroundColor: '#f44336' }]}>
            <AppText style={styles.kpiValue}>{mockKpis.pendingOffers}</AppText>
            <AppText style={styles.kpiText}>offres en cours</AppText>
          </View>
      </View>
      <View style={styles.section}>
        <AppText style={styles.texte}>Dernier leads :</AppText>
        <View style={styles.list}>
          {mockLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  // kpis
  kpis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20
  },
  kpiItem: {
    width: '48%',
    height: 100,
    padding: 20,
    borderRadius: 12
  },
  kpiValue: { 
    fontSize: 24,
    fontWeight: 'bold'
  },
  kpiText: {
    fontSize: 18,
    color: '#fff'
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