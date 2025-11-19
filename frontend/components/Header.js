class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <div class="header-top">
                    <div class="time" id="currentTime">12:53</div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <div class="points-badge">1480 pts</div>
                        <div class="cart-count-badge" id="cartCount">🛒 0</div>
                    </div>
                </div>
                
                <h1 style="margin-bottom: 1rem; font-size: 1.8rem; font-weight: 700;">Boutique</h1>
                
                <div class="search-bar">
                    <input type="text" placeholder="Rechercher un produit..." id="searchInput">
                </div>
                
                <nav class="categories">
                    <button class="category-btn active" data-category="all">Tous</button>
                    <button class="category-btn" data-category="Maillots">Maillots</button>
                    <button class="category-btn" data-category="Accessoires">Accessoires</button>
                    <button class="category-btn" data-category="Enfant">Enfant</button>
                </nav>
            </header>
            
            <nav class="bottom-nav">
                <a href="#" class="nav-item active">
                    <span>🏠</span>
                    <span>Accueil</span>
                </a>
                <a href="#" class="nav-item">
                    <span>⚙️</span>
                    <span>Réglages</span>
                </a>
            </nav>
        `;
        
        this.updateTime();
        
        // Mettre à jour le compteur après un court délai pour s'assurer que appState est disponible
        setTimeout(() => {
            this.updateCartCount();
        }, 200);
        
        // Ajouter les event listeners pour les boutons de catégories
        this.addCategoryListeners();
    }
    
    addCategoryListeners() {
        const categoryButtons = this.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Retirer la classe active de tous les boutons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                button.classList.add('active');
                
                // Récupérer la catégorie sélectionnée
                const category = button.getAttribute('data-category');
                console.log('🏷️ Catégorie sélectionnée:', category);
                
                // Déclencher un événement personnalisé pour filtrer les produits
                document.dispatchEvent(new CustomEvent('filter-category', {
                    detail: { category: category },
                    bubbles: true
                }));
            });
        });
    }
    
    updateCartCount() {
        const countElement = this.querySelector('#cartCount');
        if (countElement && window.appState) {
            const count = window.appState.getCartCount();
            countElement.textContent = `🛒 ${count}`;
            countElement.setAttribute('data-count', count);
        }
    }

    updateTime() {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        this.querySelector('#currentTime').textContent = timeString;
    }
}

// Vérifier si le composant n'est pas déjà enregistré
if (!customElements.get('app-header')) {
    customElements.define('app-header', Header);
}