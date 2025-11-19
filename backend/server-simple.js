const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware CORS pour autoriser le frontend
app.use(cors({
    origin: '*', // Autoriser toutes les origines
    credentials: false
}));

app.use(express.json());

// Données des produits - VOS PRODUITS RÉELS
const products = [
    {
        _id: '1',
        name: 'Maillet 24/25 Domicile',
        price: 59000,
        originalPrice: 69000,
        rating: 4.7,
        points: 590,
        category: 'Maillets',
        image: 'images/maillet.jpg',
        isNew: true,
        discount: null,
        deliveryFree: true,
        stock: 50
    },
    {
        _id: '2',
        name: 'Écharpe Gaindé',
        price: 12000,
        originalPrice: 14000,
        rating: 4.6,
        points: 120,
        category: 'Accessoires',
        image: 'images/echarpe.jpg',
        isNew: false,
        discount: 15,
        deliveryFree: false,
        stock: 100
    }
];

// Stockage en mémoire pour le panier
let carts = {};

// === ROUTES ===

// Route santé - TEST
app.get('/api/health', (req, res) => {
    console.log('✅ Health check appelé');
    res.json({ 
        message: '🚀 API Boutique en ligne !',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// Lister tous les produits
app.get('/api/products', (req, res) => {
    console.log('📦 Produits demandés');
    res.json({
        products: products,
        total: products.length,
        message: 'Produits chargés avec succès'
    });
});

// Détails d'un produit
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
});

// Voir le panier
app.get('/api/cart', (req, res) => {
    const userId = req.headers['user-id'] || 'default-user';
    const cart = carts[userId] || { userId, items: [], total: 0 };
    res.json(cart);
});

// Ajouter au panier
app.post('/api/cart/add', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.headers['user-id'] || 'default-user';
    
    console.log('🛒 Ajout au panier:', productId, quantity);
    
    const product = products.find(p => p._id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    if (!carts[userId]) {
        carts[userId] = { userId, items: [], total: 0 };
    }
    
    const existingItemIndex = carts[userId].items.findIndex(item => item.product._id === productId);
    
    if (existingItemIndex > -1) {
        // Produit déjà dans le panier - mettre à jour la quantité
        carts[userId].items[existingItemIndex].quantity += quantity;
    } else {
        // Nouveau produit
        carts[userId].items.push({
            product: product,
            quantity: quantity,
            price: product.price
        });
    }
    
    // Recalculer le total
    carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json(carts[userId]);
});

// Modifier la quantité
app.put('/api/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.headers['user-id'] || 'default-user';
    
    if (!carts[userId]) {
        return res.status(404).json({ message: 'Panier non trouvé' });
    }
    
    const itemIndex = carts[userId].items.findIndex(item => item.product._id === productId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }
    
    if (quantity === 0) {
        // Supprimer l'article
        carts[userId].items.splice(itemIndex, 1);
    } else {
        // Mettre à jour la quantité
        carts[userId].items[itemIndex].quantity = quantity;
    }
    
    // Recalculer le total
    carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json(carts[userId]);
});

// Supprimer un article du panier
app.delete('/api/cart/remove/:productId', (req, res) => {
    const { productId } = req.params;
    const userId = req.headers['user-id'] || 'default-user';
    
    if (!carts[userId]) {
        return res.status(404).json({ message: 'Panier non trouvé' });
    }
    
    const initialLength = carts[userId].items.length;
    carts[userId].items = carts[userId].items.filter(item => item.product._id !== productId);
    
    if (carts[userId].items.length === initialLength) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }
    
    // Recalculer le total
    carts[userId].total = carts[userId].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json(carts[userId]);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('🎉 SERVEUR BACKEND DÉMARRÉ !');
    console.log('📍 Port: ' + PORT);
    console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
    console.log('📦 Produits: http://localhost:' + PORT + '/api/products');
    console.log('🛒 Panier prêt!');
});