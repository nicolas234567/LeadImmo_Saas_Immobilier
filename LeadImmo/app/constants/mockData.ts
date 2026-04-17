export const mockLeads = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@gmail.com',
    phone: '06 12 34 56 78',
    status: 'nouveau',
    propertyId: '1',
    propertyTitle: 'Appartement 3P — 11e',
    createdAt: '2026-04-10',
  },
  {
    id: '2',
    name: 'Marc Dupont',
    email: 'marc.dupont@gmail.com',
    phone: '06 98 76 54 32',
    status: 'En contact',
    propertyId: '2',
    propertyTitle: 'Maison — Massy',
    createdAt: '2026-04-11',
  },
  {
    id: '3',
    name: 'Laura Bernard',
    email: 'laura.bernard@gmail.com',
    phone: '07 11 22 33 44',
    status: 'visite',
    propertyId: '1',
    propertyTitle: 'Appartement 3P — 11e',
    createdAt: '2026-04-12',
  },
  {
    id: '4',
    name: 'Pierre Lefranc',
    email: 'pierre.lefranc@gmail.com',
    phone: '06 55 44 33 22',
    status: 'offre',
    propertyId: '3',
    propertyTitle: 'Loft — 3e',
    createdAt: '2026-04-13',
  },
  {
    id: '5',
    name: 'Camille Roux',
    email: 'camille.roux@gmail.com',
    phone: '06 77 88 99 00',
    status: 'nouveau',
    propertyId: '2',
    propertyTitle: 'Maison — Massy',
    createdAt: '2026-04-14',
  },
]

export const mockProperties = [
  {
    id: '1',
    title: 'Appartement 3P — 11e',
    address: '24 rue de la Roquette, Paris 11e',
    price: 450000,
    status: 'available',
    leadsCount: 3,
  },
  {
    id: '2',
    title: 'Maison — Massy',
    address: '12 avenue de la République, Massy',
    price: 380000,
    status: 'under_offer',
    leadsCount: 2,
  },
  {
    id: '3',
    title: 'Loft — 3e',
    address: '8 rue du Temple, Paris 3e',
    price: 620000,
    status: 'available',
    leadsCount: 1,
  },
  {
    id: '4',
    title: 'Studio — 6e',
    address: '3 rue de Vaugirard, Paris 6e',
    price: 210000,
    status: 'sold',
    leadsCount: 0,
  },
]

// Données dashboard
export const mockKpis = {
  activeLeads: 24,
  availableProperties: 18,
  visitsThisWeek: 7,
  pendingOffers: 3 
}

export const mockRecentLeads = [
  {
    id: '1',
    name: 'Sophie Martin',
    status: 'nouveau',
    propertyTitle: 'Appartement 3P — 11e',
    createdAt: '2026-04-15',
  },
  {
    id: '2',
    name: 'Marc Dupont',
    status: 'En contact',
    propertyTitle: 'Maison — Massy',
    createdAt: '2026-04-14',
  },
  {
    id: '3',
    name: 'Laura Bernard',
    status: 'visite',
    propertyTitle: 'Studio — 6e',
    createdAt: '2026-04-13',
  },
  {
    id: '4',
    name: 'Pierre Lefranc',
    status: 'offre',
    propertyTitle: 'Loft — 3e',
    createdAt: '2026-04-12',
  },
  {
    id: '5',
    name: 'Camille Roux',
    status: 'nouveau',
    propertyTitle: 'Appartement 2P — 14e',
    createdAt: '2026-04-11',
  },
]

// Donnée biens
export const mockPropertiesDetail = [
  {
    id: '1',
    title: 'Appartement 3P — 11e',
    address: '24 rue de la Roquette, Paris 11e',
    price: 450000,
    status: 'available',
    leadsCount: 3,
    image: require('../../assets/images/properties/appart1.jpeg'),
  },
  {
    id: '2',
    title: 'Maison — Massy',
    address: '12 avenue de la République, Massy',
    price: 380000,
    status: 'under_offer',
    leadsCount: 2,
    image: require('../../assets/images/properties/maison1.jpeg'),
  },
  {
    id: '3',
    title: 'Loft — 3e',
    address: '8 rue du Temple, Paris 3e',
    price: 620000,
    status: 'available',
    leadsCount: 1,
    image: require('../../assets/images/properties/loft1.jpeg'),
  },
  {
    id: '4',
    title: 'Studio — 6e',
    address: '3 rue de Vaugirard, Paris 6e',
    price: 210000,
    status: 'sold',
    leadsCount: 0,
    image: require('../../assets/images/properties/appart2.jpeg'),
  },
]