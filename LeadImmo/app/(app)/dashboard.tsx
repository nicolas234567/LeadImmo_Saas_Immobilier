import { View, StyleSheet, Text } from 'react-native'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import { typography, colors} from '../constants/theme'
import { mockKpis, mockLeads} from '../constants/mockData'

const STATUS_COLORS: Record<string, string> = {
  nouveau: '#3B82F6',
  'En contact': '#F59E0B',
  visite: '#8B5CF6',
  offre: '#10B981',
}

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
      <View>
        <AppText style={styles.texte}>Dernier leads :</AppText>
        <View style={styles.list}>
          {mockLeads.map(lead => (
            <View key={lead.id} style={styles.row}>
              <View style={styles.avatar}>
                <AppText style={styles.avatarText}>{lead.name[0]}</AppText>
              </View>
              <View>
                <AppText style={styles.name}>{lead.name}</AppText>
                <AppText style={styles.property}>{lead.propertyTitle}</AppText>
              </View>
              <View style={[styles.statut, { backgroundColor: STATUS_COLORS[lead.status] ?? '#9CA3AF' }]}>
                <AppText style={styles.statutText}>{lead.status}</AppText>
              </View>
            </View>
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
  // dernier leads
  texte:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignContent: 'flex-start'
  },
  list: {  
    gap: 12,
    padding: 20
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    gap: 16, 
    padding: 20, 
    paddingHorizontal: 20,
    backgroundColor: '#fff', 
    borderRadius: 12 
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: colors.blue, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  avatarText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 20 
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#888' 
  },
  property: { 
    fontSize: 15, 
    color: '#888' 
  },
  // statut
  statut: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statutText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
})