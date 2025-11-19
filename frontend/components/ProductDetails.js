class ProductDetails extends HTMLElement {
    constructor() {
        super();
        this.product = null;
    }

    static get observedAttributes() {
        return ['data-product'];
    }

    connectedCallback() {
        // Récupérer le produit depuis l'attribut ou le state
        const productData = this.getAttribute('data-product');
        if (productData) {
            this.product = JSON.parse(productData);
            this.render();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-product' && newValue && newValue !== oldValue) {
            try {
                this.product = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.error('Erreur parsing product data:', e);
            }
        }
    }

    render() {
        if (!this.product) {
            this.innerHTML = '<p>Produit non trouvé</p>';
            return;
        }

        this.innerHTML = `
            <div class="product-details-container">
                <button class="back-btn" id="backBtn">← Retour</button>
                
                <div class="product-details-content">
                    <div class="product-details-image">
                        ${this.product.image ? 
                            `<img src="${this.product.image}" alt="${this.product.name}" />` : 
                            `<div class="no-image">${this.product.name}</div>`
                        }
                        ${this.product.isNew ? '<span class="new-badge">Nouveau</span>' : ''}
                        ${this.product.discount ? `<span class="discount-badge">-${this.product.discount}%</span>` : ''}
                    </div>
                    
                    <div class="product-details-info">
                        <h1 class="product-details-name">${this.product.name}</h1>
                        
                        <div class="product-details-rating">
                            <span class="rating">⭐ ${this.product.rating}</span>
                            <span class="points">≈ ${this.product.points} pts</span>
                        </div>
                        
                        <div class="product-details-price">
                            <span class="current-price">${this.formatPrice(this.product.price)} FCFA</span>
                            ${this.product.originalPrice ? 
                                `<span class="original-price">${this.formatPrice(this.product.originalPrice)} FCFA</span>` : 
                                ''
                            }
                        </div>
                        
                        <div class="product-details-features">
                            ${this.product.deliveryFree ? 
                                '<div class="feature">🚚 Livraison OFFERTE dès 50.000 FCFA</div>' : 
                                ''
                            }
                            <div class="feature">Acheter · ${this.product.points} pts</div>
                            <div class="feature">Catégorie: ${this.product.category || 'Non spécifiée'}</div>
                        </div>
                        
                        <div class="product-details-description">
                            <h3>Description</h3>
                            <p>${this.product.description || 'Aucune description disponible pour ce produit.'}</p>
                        </div>
                        
                        <div class="product-details-actions">
                            <button class="add-to-cart-btn-large" id="addToCartBtn">
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addEventListeners();
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    addEventListeners() {
        // Bouton retour
        const backBtn = this.querySelector('#backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Bouton ajouter au panier
        const addToCartBtn = this.querySelector('#addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('add-to-cart', {
                    detail: { product: this.product },
                    bubbles: true
                }));
            });
        }
    }

    show() {
        console.log('🔍 ProductDetails.show() appelé, product:', this.product);
        if (this.product) {
            this.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Empêcher le scroll
        } else {
            console.warn('⚠️ Aucun produit défini, impossible d\'afficher');
        }
    }

    hide() {
        this.style.display = 'none';
        document.body.style.overflow = ''; // Réactiver le scroll
    }
    
    // Méthode publique pour définir le produit et afficher
    setProduct(product) {
        this.product = product;
        this.render();
    }
}

if (!customElements.get('product-details')) {
    customElements.define('product-details', ProductDetails);
}

