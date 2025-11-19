const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Connecter la base de données
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'API Boutique en ligne 🛍️',
        timestamp: new Date().toISOString()
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
    console.error('Erreur:', error);
    res.status(500).json({ 
        message: 'Erreur interne du serveur', 
        error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🛍️  Serveur backend démarré sur le port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});