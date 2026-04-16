import { View, StyleSheet } from 'react-native'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { mockLeads } from '../../constants/mockData'
import { colors } from '../../constants/theme'

export default function Leads() {
  return (
    <Screen>
      <AppText style={styles.title}>Mes Leads</AppText>

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
          </View>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  list: { 
    marginTop: 20, 
    gap: 12 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 14, 
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
    fontSize: 18 
  },
  name: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#888' 
  },
  property: { 
    fontSize: 13, 
    color: '#888' 
  },
})
