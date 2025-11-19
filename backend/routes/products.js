const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products - Lister tous les produits
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        
        let filter = {};
        
        // Filtre par catégorie
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        // Recherche par nom
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        
        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
            
        const total = await Product.countDocuments(filter);
        
        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/products/:id - Détails d'un produit
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/products - Créer un produit (admin)
router.post('/', [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('price').isNumeric().withMessage('Le prix doit être un nombre'),
    body('category').isIn(['Maillets', 'Accessoires', 'Enfant']).withMessage('Catégorie invalide')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const product = new Product(req.body);
        await product.save();
        
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

module.exports = router;