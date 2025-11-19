// script.js - Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que le Header soit rendu
    setTimeout(() => {
        initializeApp();
    }, 100);
});

async function initializeApp() {
    console.log('🚀 Initialisation de l\'application...');
    
    // Vérifier que appState existe
    if (!window.appState) {
        console.error('❌ appState n\'est pas défini!');
        return;
    }
    
    // Charger le panier au démarrage
    await appState.loadCart();
    console.log('📦 Panier chargé:', appState.cart, 'Count:', appState.getCartCount());
    
    // Charger et afficher les produits
    loadProducts();
    
    // Attendre un peu pour que le Header soit complètement rendu
    setTimeout(() => {
        updateCartCounter();
    }, 300);
    
    // Écouter les changements du panier
    appState.addListener((cart) => {
        console.log('📢 Changement du panier détecté:', cart, 'Count:', appState.getCartCount());
        setTimeout(() => {
            updateCartCounter();
        }, 100);
    });
    
    // Écouter les événements d'ajout au panier
    document.addEventListener('add-to-cart', (event) => {
        const product = event.detail.product;
        console.log('🛒 Événement add-to-cart reçu pour:', product.name);
        appState.addToCart(product).then(() => {
            console.log('✅ Produit ajouté, panier maintenant:', appState.cart);
        }).catch(err => {
            console.error('❌ Erreur lors de l\'ajout:', err);
        });
    });
    
    // Écouter les événements pour afficher la page de détails
    document.addEventListener('show-product-details', (event) => {
        const product = event.detail.product;
        console.log('📄 Événement show-product-details reçu pour:', product?.name || 'produit inconnu');
        console.log('📦 Produit complet:', product);
        if (product) {
            showProductDetails(product);
        } else {
            console.error('❌ Produit manquant dans l\'événement');
        }
    });
    
    // Vérifier que le composant ProductDetails est chargé
    setTimeout(() => {
        const productDetails = document.getElementById('productDetails');
        if (productDetails) {
            console.log('✅ Composant ProductDetails trouvé dans le DOM');
        } else {
            console.error('❌ Composant ProductDetails non trouvé dans le DOM');
        }
    }, 500);
    
    // Écouter les événements pour ouvrir le checkout
    document.addEventListener('open-checkout', (event) => {
        const items = event.detail.items;
        console.log('🛒 Ouverture du checkout avec', items.length, 'articles');
        const checkout = document.getElementById('checkout');
        if (checkout) {
            checkout.show(items);
        } else {
            console.error('❌ Composant checkout non trouvé');
        }
    });
    
    // Écouter les événements de filtrage par catégorie
    document.addEventListener('filter-category', (event) => {
        const category = event.detail.category;
        console.log('🔍 Filtrage par catégorie:', category);
        filterProductsByCategory(category);
    });
    
    // Attendre un peu pour que le Header soit complètement rendu avant d'attacher le listener de recherche
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log('🔍 Recherche:', searchTerm);
                filterProductsBySearch(searchTerm);
            });
        } else {
            console.warn('⚠️ Barre de recherche non trouvée');
        }
    }, 400);
    
    console.log('✅ Application initialisée');
}

// Variable pour stocker tous les produits (non filtrés)
let allProducts = [];

// Charger les produits
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid || !window.products) return;
    
    // Stocker tous les produits
    allProducts = window.products;
    
    // Afficher tous les produits initialement
    displayProducts(allProducts);
}

// Afficher les produits dans la grille
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #718096;">Aucun produit trouvé</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('product-card');
        productCard.setAttribute('data-product', JSON.stringify(product));
        productsGrid.appendChild(productCard);
    });
}

// Filtrer les produits par catégorie
function filterProductsByCategory(category) {
    if (!window.products) return;
    
    let filteredProducts;
    
    if (category === 'all' || !category) {
        filteredProducts = allProducts;
    } else {
        // Normaliser les noms de catégories pour la comparaison
        const normalizedCategory = category.toLowerCase();
        filteredProducts = allProducts.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            // Gérer les variations de noms (Maillots vs Maillets, etc.)
            if (normalizedCategory === 'maillots') {
                return productCategory === 'maillots' || productCategory === 'maillets';
            }
            return productCategory === normalizedCategory;
        });
    }
    
    console.log('📦 Produits filtrés:', filteredProducts.length, 'sur', allProducts.length);
    displayProducts(filteredProducts);
}

// Filtrer les produits par recherche
function filterProductsBySearch(searchTerm) {
    if (!window.products) return;
    
    let filteredProducts;
    
    if (!searchTerm || searchTerm.trim() === '') {
        // Si la recherche est vide, afficher tous les produits
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => {
            const name = (product.name || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            return name.includes(searchTerm) || category.includes(searchTerm);
        });
    }
    
    console.log('🔍 Résultats de recherche:', filteredProducts.length);
    displayProducts(filteredProducts);
}

// Mettre à jour le compteur du panier
function updateCartCounter() {
    const countElement = document.getElementById('cartCount');
    if (!countElement) {
        console.warn('⚠️ Élément cartCount non trouvé, nouvelle tentative...');
        // Réessayer après un court délai si l'élément n'est pas encore disponible
        setTimeout(updateCartCounter, 50);
        return;
    }
    
    if (!window.appState) {
        console.error('❌ appState n\'est pas disponible');
        return;
    }
    
    const count = window.appState.getCartCount();
    
    // Mettre à jour le texte
    countElement.textContent = `🛒 ${count}`;
    countElement.setAttribute('data-count', count);
    
    // Mettre à jour aussi via le Header component si disponible
    const headerElement = document.querySelector('app-header');
    if (headerElement && typeof headerElement.updateCartCount === 'function') {
        headerElement.updateCartCount();
    }
    
    console.log('✅ Compteur mis à jour:', count);
}

// Fonction pour afficher la page de détails du produit
function showProductDetails(product) {
    console.log('📄 showProductDetails appelé avec:', product);
    const productDetails = document.getElementById('productDetails');
    if (!productDetails) {
        console.error('❌ Élément productDetails non trouvé');
        return;
    }
    
    console.log('✅ Élément productDetails trouvé');
    
    // Utiliser la méthode setProduct si disponible, sinon setAttribute
    if (typeof productDetails.setProduct === 'function') {
        productDetails.setProduct(product);
    } else {
        productDetails.setAttribute('data-product', JSON.stringify(product));
        // Attendre un peu pour que attributeChangedCallback se déclenche
        setTimeout(() => {
            if (productDetails.product) {
                productDetails.render();
            }
        }, 10);
    }
    
    // Afficher le popup
    setTimeout(() => {
        productDetails.show();
        console.log('✅ show() appelé');
    }, 50);
}
