# LeadImmo

Application mobile de gestion de leads immobiliers, développée avec React Native & Expo.

> **Note :** Le backend est actuellement en cours de développement. L'application fonctionne avec des données statiques en attendant.

---

## Captures d'écran

<p align="center">
  <img src="screenshot demo/dashboard.png" width="30%" alt="Tableau de bord" />
  <img src="screenshot demo/leads.png" width="30%" alt="Leads" />
  <img src="screenshot demo/biens.png" width="30%" alt="Biens" />
</p>

<p align="center">
  <em>Tableau de bord &nbsp;|&nbsp; Leads &nbsp;|&nbsp; Biens</em>
</p>

---

## Fonctionnalités

- **Tableau de bord** — KPIs et aperçu de l'activité
- **Leads** — Suivi et gestion des leads entrants, fiche détail par lead
- **Biens** — Consultation et gestion des propriétés, fiche détail par bien
- **Authentification** — Inscription, connexion, réinitialisation du mot de passe

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | Expo Router (basée sur les fichiers) |
| Langage | TypeScript |
| Backend | _En cours de développement_ |

## Démarrage

```bash
npm install
npm start        # Serveur de développement Expo
npm run android  # Android
npm run ios      # iOS
```

## Structure du projet

```
app/
├── (auth)/            # Inscription, connexion, réinitialisation du mot de passe
│   ├── login.tsx
│   ├── register.tsx
│   ├── resetMdp.tsx
│   └── confirmationResetMdp.tsx
├── (app)/             # Écrans authentifiés
│   ├── dashboard.tsx
│   ├── leads/
│   │   ├── index.tsx
│   │   └── [id].tsx   # Fiche détail lead
│   └── properties/
│       ├── index.tsx
│       └── [id].tsx   # Fiche détail bien
├── services/          # Couche d'accès aux données (mock → API)
│   ├── leads.ts
│   └── properties.ts
├── types/             # Types TypeScript
│   ├── lead.ts
│   └── property.ts
└── _layout.tsx
```
