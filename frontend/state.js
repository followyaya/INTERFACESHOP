// state.js - Gestion d'état global avec persistance localStorage
class AppState {
    constructor() {
        this.listeners = [];
        this.userId = this.getOrCreateUserId();
        this.cart = this.loadCartFromStorage();
        this.STORAGE_KEY = 'shop_cart';
        this.USER_ID_KEY = 'shop_user_id';
    }

    // Récupérer ou créer un userId et le sauvegarder
    getOrCreateUserId() {
        let userId = localStorage.getItem(this.USER_ID_KEY);
        if (!userId) {
            userId = 'user-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.USER_ID_KEY, userId);
        }
        return userId;
    }

    // Charger le panier depuis localStorage
    loadCartFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const cart = JSON.parse(stored);
                // Valider la structure du panier
                if (Array.isArray(cart)) {
                    return cart;
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement du panier depuis localStorage:', error);
        }
        return [];
    }

    // Sauvegarder le panier dans localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));
            console.log('💾 Panier sauvegardé dans localStorage');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    }

    // Notifier tous les écouteurs et sauvegarder
    notifyListeners() {
        this.saveCartToStorage(); // Sauvegarder à chaque changement
        this.listeners.forEach(listener => {
            try {
                listener(this.cart);
            } catch (error) {
                console.error('Erreur dans un listener:', error);
            }
        });
    }
async updateQuantity(productId, newQuantity) {
    try {
        const response = await fetch('http://localhost:3001/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'user-id': this.userId
            },
            body: JSON.stringify({
                productId: productId,
                quantity: newQuantity
            })
        });

            if (response.ok) {
                const cartData = await response.json();
                this.cart = cartData.items || [];
                this.notifyListeners(); // Sauvegarde automatique
            } else {
                throw new Error('Réponse API non OK');
            }
        } catch (error) {
            console.error('Erreur mise à jour quantité:', error);
            this.updateQuantityLocal(productId, newQuantity);
        }
}

updateQuantityLocal(productId, newQuantity) {
    if (newQuantity <= 0) {
        this.removeItemLocal(productId);
        return;
    }

    const searchId = String(productId);
    const item = this.cart.find(item => {
        const itemId = String(item.product._id || item.product.id);
        return itemId === searchId;
    });
    
    if (item) {
        item.quantity = newQuantity;
        this.notifyListeners(); // Sauvegarde automatique
    }
}

async removeItem(productId) {
    try {
        const response = await fetch(`http://localhost:3001/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'user-id': this.userId
            }
        });

            if (response.ok) {
                const cartData = await response.json();
                this.cart = cartData.items || [];
                this.notifyListeners(); // Sauvegarde automatique
            } else {
                throw new Error('Réponse API non OK');
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            this.removeItemLocal(productId);
        }
}

removeItemLocal(productId) {
    const searchId = String(productId);
    this.cart = this.cart.filter(item => {
        const itemId = String(item.product._id || item.product.id);
        return itemId !== searchId;
    });
    this.notifyListeners(); // Sauvegarde automatique
}
    // Ajouter un produit au panier
    async addToCart(product) {
        console.log('🛒 Ajout au panier via state:', product.name);
        
        try {
            // Appeler l'API
            const response = await fetch('http://localhost:3001/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': this.userId
                },
                body: JSON.stringify({
                    productId: product._id || product.id,
                    quantity: 1
                })
            });

            if (response.ok) {
                const cartData = await response.json();
                this.cart = cartData.items || [];
                console.log('✅ Panier mis à jour:', this.cart, 'Count:', this.getCartCount());
                this.notifyListeners(); // Sauvegarde automatique dans localStorage
                return Promise.resolve();
            } else {
                throw new Error('Réponse API non OK');
            }
        } catch (error) {
            console.error('❌ Erreur API, utilisation du mode local:', error);
            this.addToCartLocal(product);
            return Promise.resolve();
        }
    }

    addToCartLocal(product) {
        const productId = String(product._id || product.id);
        const existingItem = this.cart.find(item => {
            const itemId = String(item.product._id || item.product.id);
            return itemId === productId;
        });
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                product: product,
                quantity: 1,
                price: product.price
            });
        }
        
        this.notifyListeners(); // Sauvegarde automatique via notifyListeners
    }

    // Charger le panier (API ou localStorage)
    async loadCart() {
        try {
            const response = await fetch('http://localhost:3001/api/cart', {
                headers: {
                    'user-id': this.userId
                }
            });
            
            if (response.ok) {
                const cartData = await response.json();
                this.cart = cartData.items || [];
                this.saveCartToStorage(); // Synchroniser avec localStorage
            } else {
                throw new Error('Réponse API non OK');
            }
        } catch (error) {
            console.log('📦 Utilisation du panier local depuis localStorage');
            this.cart = this.loadCartFromStorage();
        }
        this.notifyListeners();
    }

    // Vider le panier
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.notifyListeners();
    }

    // Ajouter un écouteur
    addListener(listener) {
        this.listeners.push(listener);
    }

    // Obtenir le nombre d'articles
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Instance globale
window.appState = new AppState();