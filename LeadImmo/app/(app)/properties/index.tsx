import { View, Image, Text, StyleSheet } from 'react-native'
import Screen from '../../components/Screen'
import AppText from '../../components/AppText'
import { mockPropertiesDetail } from '../../constants/mockData'
import { colors, spacing, radius } from '../../constants/theme'

const STATUS_LABELS: Record<string, string> = {
  available:   'Disponible',
  under_offer: 'Sous offre',
  sold:        'Vendu',
}

const STATUS_COLORS: Record<string, string> = {
  available:   colors.green,
  under_offer: colors.amber,
  sold:        colors.red,
}

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR') + ' €'
}

export default function Properties() {
  return (
    <Screen>
      <AppText style={styles.title}>Mes Biens</AppText>

      <View style={styles.list}>
        {mockPropertiesDetail.map(property => (
          <View key={property.id} style={styles.card}>
            <Image source={property.image} style={styles.image} />

            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={[styles.propertyTitle]} numberOfLines={1}>
                  {property.title}
                </Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[property.status] ?? colors.lightGray }]}>
                  <AppText style={styles.badgeText}>{STATUS_LABELS[property.status] ?? property.status}</AppText>
                </View>
              </View>

              <Text style={styles.address} numberOfLines={1}>{property.address}</Text>

              <View style={styles.footer}>
                <AppText style={styles.price}>{formatPrice(property.price)}</AppText>
                <AppText style={styles.leads}>{property.leadsCount} lead{property.leadsCount !== 1 ? 's' : ''}</AppText>
              </View>
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
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  list: {
    gap: 14,
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray800,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 13,
    color: colors.lightGray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.blue,
  },
  leads: {
    fontSize: 13,
    color: colors.lightGray,
  },
})
