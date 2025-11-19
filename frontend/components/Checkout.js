class Checkout extends HTMLElement {
    constructor() {
        super();
        this.cartItems = [];
        this.selectedPaymentMethod = null;
    }

    connectedCallback() {
        // Le composant sera initialisé avec des données
    }

    show(cartItems) {
        this.cartItems = cartItems;
        this.render();
        this.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.style.display = 'none';
        document.body.style.overflow = '';
    }

    render() {
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);

        this.innerHTML = `
            <div class="checkout-overlay" id="checkoutOverlay">
                <div class="checkout-container">
                    <button class="checkout-back-btn" id="checkoutBackBtn">← Retour</button>
                    
                    <h1 class="checkout-title">Finaliser la commande</h1>
                    
                    <div class="checkout-content">
                        <div class="checkout-summary">
                            <h2>Résumé de la commande</h2>
                            <div class="checkout-items">
                                ${this.cartItems.map(item => this.renderCheckoutItem(item)).join('')}
                            </div>
                            
                            <div class="checkout-totals">
                                <div class="checkout-total-line">
                                    <span>Articles (${totalItems})</span>
                                    <span>${this.formatPrice(total)} FCFA</span>
                                </div>
                                <div class="checkout-total-line">
                                    <span>Livraison</span>
                                    <span>Gratuite</span>
                                </div>
                                <div class="checkout-total-line checkout-total-final">
                                    <span>Total</span>
                                    <span>${this.formatPrice(total)} FCFA</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="checkout-form">
                            <h2>Informations de livraison</h2>
                            <form id="checkoutForm">
                                <div class="form-group">
                                    <label for="customerName">Nom complet</label>
                                    <input type="text" id="customerName" name="customerName" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="customerPhone">Téléphone</label>
                                    <input type="tel" id="customerPhone" name="customerPhone" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="customerAddress">Adresse de livraison</label>
                                    <textarea id="customerAddress" name="customerAddress" rows="3" required></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label>Méthode de paiement</label>
                                    <div class="payment-methods">
                                        <label class="payment-method-option">
                                            <input type="radio" name="paymentMethod" value="cash" required>
                                            <div class="payment-method-card">
                                                <span class="payment-icon">💵</span>
                                                <span class="payment-label">Paiement en espèces</span>
                                            </div>
                                        </label>
                                        
                                        <label class="payment-method-option">
                                            <input type="radio" name="paymentMethod" value="wave" required>
                                            <div class="payment-method-card">
                                                <span class="payment-icon">📱</span>
                                                <span class="payment-label">Wave</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="checkout-submit-btn" id="checkoutSubmitBtn">
                                    Confirmer la commande
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addEventListeners();
    }

    renderCheckoutItem(item) {
        const product = item.product;
        return `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${product.name}</h4>
                    <p>Quantité: ${item.quantity} × ${this.formatPrice(product.price)} FCFA</p>
                </div>
                <div class="checkout-item-price">
                    ${this.formatPrice(item.price * item.quantity)} FCFA
                </div>
            </div>
        `;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    addEventListeners() {
        // Bouton retour
        const backBtn = this.querySelector('#checkoutBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Fermer en cliquant sur l'overlay
        const overlay = this.querySelector('#checkoutOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hide();
                }
            });
        }

        // Formulaire de commande
        const form = this.querySelector('#checkoutForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout(form);
            });
        }
    }

    handleCheckout(form) {
        const formData = new FormData(form);
        const orderData = {
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            customerAddress: formData.get('customerAddress'),
            paymentMethod: formData.get('paymentMethod'),
            items: this.cartItems,
            total: this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };

        console.log('📦 Commande créée:', orderData);

        // Afficher un message de confirmation
        alert(`✅ Commande confirmée!\n\nMerci ${orderData.customerName}!\nVotre commande sera livrée à l'adresse indiquée.\nMéthode de paiement: ${orderData.paymentMethod === 'cash' ? 'Espèces' : 'Wave'}\n\nTotal: ${this.formatPrice(orderData.total)} FCFA`);

        // Vider le panier via appState
        if (window.appState) {
            window.appState.clearCart();
        }

        // Fermer le checkout
        this.hide();
    }
}

if (!customElements.get('app-checkout')) {
    customElements.define('app-checkout', Checkout);
}

