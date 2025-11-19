class Cart extends HTMLElement {
    constructor() {
        super();
        // Le composant Cart utilise uniquement appState comme source de vérité
        // Pas d'état local pour éviter les désynchronisations
    }

    connectedCallback() {
        // S'abonner aux changements du panier via appState
        if (window.appState) {
            // Rendre immédiatement avec le panier actuel
            this.updateCart(window.appState.cart);
            
            // Écouter les changements futurs
            window.appState.addListener((cart) => {
                this.updateCart(cart);
            });
        } else {
            console.error('❌ appState non disponible');
            this.renderEmpty();
        }
    }

    // Mettre à jour le panier depuis appState (source unique de vérité)
    updateCart(cart) {
        this.items = cart || [];
        this.render();
    }

    renderEmpty() {
        this.innerHTML = `
            <div class="cart-empty">
                <p>Votre panier est vide</p>
            </div>
        `;
    }

    render() {
        this.innerHTML = this.renderCart();
        this.addEventListeners();
    }

    renderCart() {
        if (this.items.length === 0) {
            return `
                <div class="cart-empty">
                    <p>Votre panier est vide</p>
                </div>
            `;
        }

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return `
            <div class="cart">
                <h2>Panier</h2>
                <div class="cart-items">
                    ${this.items.map(item => this.renderCartItem(item)).join('')}
                </div>
                <div class="cart-total">
                    <strong>Total: ${this.formatPrice(total)} FCFA</strong>
                </div>
                <button class="checkout-btn" id="checkoutBtn">Passer la commande</button>
            </div>
        `;
    }

    renderCartItem(item) {
        const product = item.product;
        return `
            <div class="cart-item" data-product-id="${product._id || product.id}">
                <div class="item-info">
                    <h4>${product.name}</h4>
                    <p class="item-price">${this.formatPrice(product.price)} FCFA</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-btn">🗑️</button>
            </div>
        `;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    addEventListeners() {
        // Écouter les boutons de quantité (+ et -)
        const quantityButtons = this.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const cartItem = e.target.closest('.cart-item');
                if (!cartItem) return;
                
                const productId = cartItem.getAttribute('data-product-id');
                const isPlus = button.classList.contains('plus');
                const isMinus = button.classList.contains('minus');
                
                console.log('🔘 Bouton cliqué:', isPlus ? '+' : '-', 'ProductId:', productId);
                
                // Trouver l'item dans le panier
                const item = this.items.find(item => {
                    const itemId = String(item.product._id || item.product.id);
                    const searchId = String(productId);
                    return itemId === searchId;
                });
                
                if (!item) {
                    console.warn('⚠️ Item non trouvé pour productId:', productId);
                    return;
                }
                
                let newQuantity = item.quantity;
                
                if (isPlus) {
                    newQuantity = item.quantity + 1;
                } else if (isMinus) {
                    newQuantity = Math.max(0, item.quantity - 1);
                }
                
                console.log('📊 Nouvelle quantité:', newQuantity, 'pour productId:', productId);
                
                // Mettre à jour via appState
                if (window.appState) {
                    if (newQuantity <= 0) {
                        console.log('🗑️ Suppression de l\'article');
                        window.appState.removeItem(productId);
                    } else {
                        console.log('➕ Mise à jour de la quantité');
                        window.appState.updateQuantity(productId, newQuantity);
                    }
                } else {
                    // Fallback local
                    console.log('💾 Mode local - mise à jour');
                    this.updateQuantityLocal(productId, newQuantity);
                }
            });
        });
        
        // Écouter les boutons de suppression
        const removeButtons = this.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const cartItem = e.target.closest('.cart-item');
                if (!cartItem) return;
                
                const productId = cartItem.getAttribute('data-product-id');
                console.log('🗑️ Suppression demandée pour productId:', productId);
                
                // Supprimer via appState
                if (window.appState) {
                    window.appState.removeItem(productId);
                } else {
                    // Fallback local
                    this.removeItemLocal(productId);
                }
            });
        });
        
        // Bouton passer la commande
        const checkoutBtn = this.querySelector('#checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    alert('Votre panier est vide');
                    return;
                }
                // Déclencher l'événement pour ouvrir le checkout
                this.dispatchEvent(new CustomEvent('open-checkout', {
                    detail: { items: this.items },
                    bubbles: true
                }));
            });
        }
    }
    
    // Toutes les modifications passent par appState (pas de logique locale)
}

if (!customElements.get('app-cart')) {
    customElements.define('app-cart', Cart);
}