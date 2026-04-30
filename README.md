# LeadImmo — Application mobile

Application mobile de gestion de leads immobiliers, développée avec React Native & Expo, connectée à une API REST Node.js/Express.

> **Backend :** [LeadImmo API](https://github.com/nicolas234567/LeadImmo_Saas_Immobilier_Backend) — documentation complète dans le [README du backend](https://github.com/nicolas234567/LeadImmo_Saas_Immobilier_Backend#readme).

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
- **Leads** — Suivi et gestion des leads entrants, fiche détail par lead (statut, budget, notes, bien associé)
- **Biens** — Consultation et gestion des propriétés avec photo, fiche détail par bien
- **Authentification** — Inscription, connexion, token JWT stocké de façon sécurisée (expo-secure-store sur iOS/Android, localStorage sur web)

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | Expo Router (basée sur les fichiers) |
| Langage | TypeScript |
| HTTP | fetch natif + wrapper `apiFetch` avec JWT |
| Stockage token | expo-secure-store (iOS/Android) · sessionStorage (web uniquement pour la démo) |
| Plateformes | iOS · Android · Web (react-native-web) |
| Backend | API REST Node.js/Express + PostgreSQL |

## Démarrage

```bash
npm install
npm start        # Serveur de développement Expo
npm run android  # Android
npm run ios      # iOS
npm run web      # Navigateur (react-native-web)
```

Configurer l'URL de l'API dans [app/constants/config.ts](LeadImmo/app/constants/config.ts) :

```ts
export const API_URL = 'http://<ip-de-votre-machine>:3000'
```

## Structure du projet

```
LeadImmo/
└── app/
    ├── (auth)/                      # Écrans non authentifiés
    │   ├── login.tsx
    │   ├── register.tsx
    │   ├── resetMdp.tsx
    │   └── confirmationResetMdp.tsx
    ├── (app)/                       # Écrans authentifiés
    │   ├── dashboard.tsx
    │   ├── leads/
    │   │   ├── index.tsx            # Liste des leads
    │   │   └── [id].tsx             # Fiche détail lead
    │   └── properties/
    │       ├── index.tsx            # Liste des biens
    │       └── [id].tsx             # Fiche détail bien
    ├── components/                  # Composants réutilisables
    │   ├── AppText.tsx
    │   ├── Field.tsx               # Champ de formulaire générique
    │   ├── LeadCard.tsx
    │   └── Screen.tsx
    ├── styles/
    │   └── leadForm.ts             # Styles partagés des modales leads
    ├── constants/
    │   ├── api.ts                   # Wrapper HTTP avec auth JWT
    │   ├── config.ts                # URL de l'API
    │   └── theme.ts                 # Couleurs et styles globaux
    ├── services/                    # Couche d'accès à l'API
    │   ├── auth.ts                  # login / register / saveToken / getToken
    │   ├── leads.ts                 # CRUD leads
    │   └── properties.ts            # CRUD propriétés (+ upload image)
    ├── types/                       # Types TypeScript
    │   ├── lead.ts
    │   └── property.ts
    ├── index.tsx                    # Point d'entrée (redirection auth)
    └── _layout.tsx                  # Layout racine
```

## Authentification

Le flux est le suivant :

**Inscription**
1. `register.tsx` appelle `services/auth.ts → register()` qui POST sur `/auth/createAccount`
2. En cas de succès, l'utilisateur est redirigé vers l'écran de connexion

**Connexion**
1. `login.tsx` appelle `services/auth.ts → login()` qui POST sur `/auth/login`
2. Le token JWT reçu est sauvegardé via `saveToken()` dans le SecureStore
3. Chaque requête API passe par `apiFetch()` qui lit le token et l'injecte en header `Authorization: Bearer <token>`
4. Si le token est absent ou expiré, l'API répond 401/403 et l'application redirige vers la connexion
