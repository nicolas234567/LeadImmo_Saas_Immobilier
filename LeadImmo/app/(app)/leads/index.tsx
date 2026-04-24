import { View, StyleSheet } from 'react-native'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import LeadCard from '../../components/LeadCard'
import { getLeads } from '../../services/leads'

export default function Leads() {
  const leads = getLeads()

  return (
    <Screen>
      <AppText style={styles.title}>Mes Leads</AppText>

      <View style={styles.list}>
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
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
})
