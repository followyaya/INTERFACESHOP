# 🛍️ Interface Boutique - Application Web et Mobile

Application complète de boutique en ligne avec panier, développée en JavaScript (frontend web) et Flutter (mobile), utilisant un backend Node.js/Express.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [API Backend](#api-backend)
- [Développement](#développement)

## 🎯 Vue d'ensemble

Ce projet comprend trois parties principales :
- **Backend** : API REST Node.js/Express avec MongoDB
- **Frontend Web** : Application web vanilla JavaScript avec Web Components
- **Application Mobile** : Application Flutter pour Android/iOS

### Exigences respectées

✅ **Page listant les produits** - Affichage en grille avec images, prix, notes  
✅ **Page de détails d'un produit** - Modal avec toutes les informations  
✅ **Ajout au panier** - Fonctionnalité complète avec compteur  
✅ **Page panier** avec :
  - Consultation des articles
  - Modification de la quantité (+/-)
  - Suppression d'un article
✅ **Persistance locale du panier** - localStorage pour le web, SharedPreferences pour mobile  
✅ **Gestion d'état propre** - Pattern Observer avec AppState centralisé  
✅ **Composantisation claire** - Web Components pour le web, Widgets pour Flutter

## 🏗️ Architecture

```
InterfaceShop/
├── backend/          # API REST Node.js/Express
├── frontend/         # Application web (HTML/CSS/JS)
└── mobile/          # Application Flutter
```

### Flux de données

```
Frontend/Mobile → API Backend → MongoDB
       ↓
  localStorage/SharedPreferences (persistance locale)
```

## ✨ Fonctionnalités

### Frontend Web

- 📱 **Interface responsive** avec design moderne
- 🔍 **Recherche de produits** en temps réel
- 🏷️ **Filtrage par catégorie** (Tous, Maillots, Accessoires, Enfant)
- 🛒 **Panier interactif** avec compteur dans le header
- 📄 **Page de détails produit** en modal
- 💾 **Persistance du panier** via localStorage
- 🎨 **Design moderne** avec animations et transitions

### Application Mobile (Flutter)

- 📱 **Interface native** Android/iOS
- 🔍 **Recherche et filtrage** identiques au web
- 🛒 **Panier synchronisé** avec le backend
- 💾 **Persistance locale** via SharedPreferences
- 📄 **Navigation complète** entre écrans
- 🎨 **UI Material Design 3**

### Backend

- 🔌 **API REST** complète
- 🗄️ **Base de données MongoDB** (optionnelle, fallback en mémoire)
- 🔐 **Gestion des utilisateurs** par userId
- 📦 **Gestion du panier** avec CRUD complet
- 🌐 **CORS configuré** pour le frontend

## 🚀 Installation

### Prérequis

- **Node.js** (v14 ou supérieur)
- **MongoDB** (optionnel, l'API fonctionne aussi en mode mémoire)
- **Flutter** (pour l'application mobile, v3.0+)

### Backend

```bash
cd backend
npm install
```

**Configuration MongoDB (optionnel)** :
- Créer un fichier `.env` avec :
  ```
  MONGODB_URI=mongodb://localhost:27017/shop
  PORT=3001
  ```

**Démarrer le serveur** :
```bash
# Mode simple (mémoire)
node server-simple.js

# Mode avec MongoDB
node server.js
```

Le serveur démarre sur `http://localhost:3001`

### Frontend Web

```bash
cd frontend
# Aucune installation nécessaire, fichiers statiques
```

**Ouvrir dans le navigateur** :
- Ouvrir `index.html` directement, ou
- Utiliser un serveur local (ex: `python -m http.server 8000`)

### Application Mobile

```bash
cd mobile
flutter pub get
```

**Configurer l'URL de l'API** dans `lib/utils/constants.dart` :
- Android Emulator : `http://10.0.2.2:3001/api`
- iOS Simulator : `http://localhost:3001/api`
- Device physique : `http://VOTRE_IP:3001/api`

**Lancer l'application** :
```bash
flutter run
```

## 📖 Utilisation

### Frontend Web

1. **Ouvrir** `frontend/index.html` dans un navigateur
2. **Parcourir** les produits dans la grille
3. **Filtrer** par catégorie ou rechercher
4. **Cliquer** sur une image/nom de produit pour voir les détails
5. **Ajouter** des produits au panier
6. **Modifier** les quantités dans le panier (boutons +/-)
7. **Supprimer** des articles (bouton 🗑️)
8. **Passer commande** via le bouton "Passer la commande"

### Application Mobile

1. **Lancer** l'application Flutter
2. **Navigation** identique au web
3. **Panier** accessible via l'icône dans l'AppBar
4. **Checkout** avec formulaire de livraison et paiement

## 📁 Structure du projet

### Backend

```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── middleware/
│   └── auth.js              # Middleware authentification
├── models/
│   ├── Product.js           # Modèle produit
│   └── Cart.js              # Modèle panier
├── routes/
│   ├── products.js          # Routes produits
│   └── cart.js              # Routes panier
├── server.js                # Serveur avec MongoDB
└── server-simple.js         # Serveur simple (mémoire)
```

### Frontend Web

```
frontend/
├── components/
│   ├── Header.js            # En-tête avec recherche et filtres
│   ├── ProductCard.js       # Carte produit
│   ├── ProductDetails.js    # Page détails produit
│   ├── Cart.js              # Composant panier
│   └── Checkout.js          # Page checkout
├── data/
│   └── products.js          # Données produits (fallback)
├── state.js                 # Gestion d'état global (AppState)
├── script.js                # Initialisation et logique principale
├── style.css                # Styles CSS
└── index.html               # Page principale
```

### Application Mobile

```
mobile/
├── lib/
│   ├── main.dart            # Point d'entrée
│   ├── models/              # Modèles de données
│   ├── services/            # Services (API, State)
│   ├── screens/             # Écrans
│   ├── widgets/             # Widgets réutilisables
│   └── utils/               # Utilitaires
└── pubspec.yaml             # Dépendances Flutter
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données (optionnel)
- **Mongoose** - ODM pour MongoDB

### Frontend Web
- **Vanilla JavaScript** - Pas de framework
- **Web Components** - Custom Elements API
- **CSS3** - Styles modernes avec animations
- **localStorage** - Persistance locale

### Application Mobile
- **Flutter** - Framework cross-platform
- **Dart** - Langage de programmation
- **Provider** - Gestion d'état
- **HTTP** - Client HTTP
- **SharedPreferences** - Persistance locale

## 🔌 API Backend

### Endpoints

#### Produits

- `GET /api/products` - Lister tous les produits
- `GET /api/products/:id` - Obtenir un produit

#### Panier

- `GET /api/cart` - Obtenir le panier de l'utilisateur
- `POST /api/cart/add` - Ajouter un produit au panier
  ```json
  {
    "productId": "1",
    "quantity": 1
  }
  ```
- `PUT /api/cart/update` - Modifier la quantité
  ```json
  {
    "productId": "1",
    "quantity": 2
  }
  ```
- `DELETE /api/cart/remove/:productId` - Supprimer un article

#### Health Check

- `GET /api/health` - Vérifier l'état du serveur

### Headers requis

Toutes les requêtes panier nécessitent :
```
user-id: <userId>
```

## 💾 Persistance locale

### Frontend Web

Le panier est sauvegardé automatiquement dans `localStorage` avec la clé `shop_cart`. La sauvegarde se fait à chaque modification :
- Ajout d'article
- Modification de quantité
- Suppression d'article
- Chargement au démarrage

### Application Mobile

Le panier est sauvegardé dans `SharedPreferences` avec la clé `shop_cart`. Synchronisation automatique avec le backend quand disponible.

## 🎨 Gestion d'état

### Frontend Web

**Pattern Observer** avec `AppState` :
- Source unique de vérité : `window.appState`
- Composants abonnés via `addListener()`
- Sauvegarde automatique dans localStorage
- Synchronisation avec l'API backend

**Exemple** :
```javascript
// Écouter les changements
appState.addListener((cart) => {
  console.log('Panier mis à jour:', cart);
});

// Ajouter au panier
appState.addToCart(product);
```

### Application Mobile

**Provider** pour la gestion d'état :
- `CartService` : Gestion du panier
- `ProductService` : Gestion des produits et filtres
- Notifications automatiques aux widgets

## 🧩 Composantisation

### Frontend Web

**Web Components** :
- `<app-header>` - En-tête avec navigation
- `<product-card>` - Carte produit
- `<product-details>` - Détails produit (modal)
- `<app-cart>` - Panier
- `<app-checkout>` - Checkout

Chaque composant est autonome et communique via des événements personnalisés.

### Application Mobile

**Widgets Flutter** :
- `ProductCard` - Carte produit
- `ProductGrid` - Grille de produits
- `CategoryFilter` - Filtres de catégorie
- `SearchBar` - Barre de recherche

**Écrans** :
- `HomeScreen` - Écran principal
- `ProductDetailScreen` - Détails produit
- `CartScreen` - Panier
- `CheckoutScreen` - Checkout

## 🔄 Synchronisation Backend ↔ Frontend

Le système fonctionne en mode **hybride** :

1. **Tentative API** : Toutes les opérations essaient d'abord l'API
2. **Fallback local** : Si l'API échoue, utilisation du mode local
3. **Synchronisation** : Le panier local est synchronisé avec l'API quand disponible

## 📱 Responsive Design

### Frontend Web
- **Desktop** : Grille de produits en colonnes multiples
- **Tablet** : Adaptation automatique
- **Mobile** : Layout optimisé avec navigation bottom

### Application Mobile
- **Android** : Material Design 3
- **iOS** : Cupertino Design
- **Adaptatif** : S'adapte à toutes les tailles d'écran

## 🧪 Tests

### Backend
```bash
# Tester l'API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/products
```

### Frontend Web
- Ouvrir la console du navigateur (F12)
- Tester les fonctions : `testCartCounter()`

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifier que le port 3001 est libre
- Vérifier les dépendances : `npm install`

### Frontend ne charge pas les produits
- Vérifier que le backend est démarré
- Vérifier la console pour les erreurs CORS
- Vérifier l'URL de l'API dans le code

### Mobile ne se connecte pas au backend
- **Android Emulator** : Utiliser `10.0.2.2` au lieu de `localhost`
- **Device physique** : Utiliser l'IP de votre machine
- Vérifier que le backend accepte les connexions depuis le réseau

### Panier ne persiste pas
- Vérifier que localStorage est activé dans le navigateur
- Vérifier la console pour les erreurs de sauvegarde

## 📝 Notes de développement

### Backend
- Le serveur `server-simple.js` fonctionne sans MongoDB
- Le serveur `server.js` nécessite MongoDB
- Les deux utilisent le même système de routes

### Frontend Web
- Pas de build nécessaire, fichiers statiques
- Compatible avec tous les navigateurs modernes
- Web Components natifs (pas de polyfill nécessaire)

### Mobile
- Nécessite Flutter SDK installé
- Compatible Android et iOS
- Hot reload disponible pendant le développement

## 🚀 Déploiement

### Backend
- Déployer sur Heroku, Vercel, ou serveur Node.js
- Configurer les variables d'environnement
- S'assurer que MongoDB est accessible (si utilisé)

### Frontend Web
- Déployer les fichiers statiques sur Netlify, Vercel, ou serveur web
- Configurer l'URL de l'API dans le code

### Application Mobile
- Build Android : `flutter build apk`
- Build iOS : `flutter build ios`
- Publier sur Google Play Store / App Store



## 👥 Auteur

Développé par sidy yaya traore.

---

## 📚 Documentation supplémentaire

### Commandes utiles

**Backend** :
```bash
npm start              # Démarrer le serveur
npm run dev            # Mode développement (si configuré)
```

**Frontend** :
- Ouvrir `index.html` dans le navigateur
- Ou utiliser un serveur local : `python -m http.server 8000`

**Mobile** :
```bash
flutter pub get        # Installer les dépendances
flutter run            # Lancer l'app
flutter build apk      # Build Android
flutter build ios      # Build iOS
```

### Structure des données

**Produit** :
```json
{
  "id": "1",
  "name": "Maillet 24/25 Domicile",
  "price": 59000,
  "originalPrice": 69000,
  "rating": 4.7,
  "points": 590,
  "category": "Maillets",
  "image": "images/maillet.jpg",
  "isNew": true,
  "discount": null,
  "deliveryFree": true
}
```

**Article du panier** :
```json
{
  "product": { /* Produit complet */ },
  "quantity": 2,
  "price": 59000
}
```

---

**🎉 Projet complet et fonctionnel !**

