class ProductCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const product = JSON.parse(this.getAttribute('data-product'));
        this.innerHTML = this.renderProductCard(product);
        this.addEventListeners(product);
    }

    renderProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id || product._id}">
            ${product.isNew ? '<span class="new-badge">Nouveau</span>' : ''}
            
            <div class="product-image clickable">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.style.display='none'; if(!this.parentElement.querySelector('span')) { this.parentElement.innerHTML='<span>${product.name}</span>'; }" />` : 
                    `<span>${product.name}</span>`
                }
            </div>
            
            <div class="product-info">
                <h3 class="product-name clickable">${product.name}</h3>
                
                <div class="price-section">
                    <span class="current-price">${this.formatPrice(product.price)} FCFA</span>
                    ${product.originalPrice ? 
                        `<span class="original-price">${this.formatPrice(product.originalPrice)} FCFA</span>` : 
                        ''
                    }
                </div>
                
                <div class="rating-section">
                    <span class="rating">⭐ ${product.rating}</span>
                    <span class="points">≈ ${product.points} pts</span>
                </div>
                
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Ajouter au panier
                </button>
                
                <div class="product-features">
                    <div class="feature">Acheter · ${product.points} pts</div>
                    ${product.deliveryFree ? 
                        '<div class="feature">🚚 Livraison OFFERTE dès 50.000 FCFA</div>' : 
                        ''
                    }
                    ${product.discount ? 
                        `<div class="feature discount">-${product.discount}%</div>` : 
                        ''
                    }
                </div>
            </div>
        </div>
    `;
}

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    addEventListeners(product) {
        // Bouton ajouter au panier
        const addToCartBtn = this.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêcher l'ouverture de la page de détails
                this.dispatchEvent(new CustomEvent('add-to-cart', {
                    detail: { product },
                    bubbles: true
                }));
            });
        }

        // Rendre la carte cliquable pour ouvrir les détails
        const card = this.querySelector('.product-card');
        const clickableElements = this.querySelectorAll('.clickable');
        
        clickableElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('show-product-details', {
                    detail: { product },
                    bubbles: true
                }));
            });
        });
    }
}

if (!customElements.get('product-card')) {
    customElements.define('product-card', ProductCard);
}