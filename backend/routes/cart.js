const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateUserId } = require('../middleware/auth');
const router = express.Router();

// Appliquer le middleware pour toutes les routes
router.use(generateUserId);

// GET /api/cart - Voir le panier
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.userId }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [] });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/cart/add - Ajouter un article au panier
router.post('/add', [
    body('productId').notEmpty().withMessage('ID produit requis'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantité doit être positive')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { productId, quantity } = req.body;
        
        // Vérifier si le produit existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        // Vérifier le stock
        if (product.stock < quantity) {
            return res.status(400).json({ 
                message: `Stock insuffisant. Disponible: ${product.stock}` 
            });
        }
        
        let cart = await Cart.findOne({ userId: req.userId });
        
        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [] });
        }
        
        // Vérifier si le produit est déjà dans le panier
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (existingItemIndex > -1) {
            // Mettre à jour la quantité
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Ajouter nouveau produit
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price
            });
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// PUT /api/cart/update - Modifier la quantité
router.put('/update', [
    body('productId').notEmpty().withMessage('ID produit requis'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantité invalide')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { productId, quantity } = req.body;
        
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }
        
        if (quantity === 0) {
            // Supprimer l'article si quantité = 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Vérifier le stock
            const product = await Product.findById(productId);
            if (product.stock < quantity) {
                return res.status(400).json({ 
                    message: `Stock insuffisant. Disponible: ${product.stock}` 
                });
            }
            
            // Mettre à jour la quantité
            cart.items[itemIndex].quantity = quantity;
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// DELETE /api/cart/remove/:productId - Retirer un article
router.delete('/remove/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }
        
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );
        
        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }
        
        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// DELETE /api/cart/clear - Vider le panier
router.delete('/clear', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }
        
        cart.items = [];
        await cart.save();
        
        res.json({ message: 'Panier vidé avec succès', cart });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

module.exports = router;