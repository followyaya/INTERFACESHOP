import 'package:flutter/foundation.dart';
import '../models/product.dart';
import 'api_service.dart';

class ProductService extends ChangeNotifier {
  List<Product> _products = [];
  List<Product> _filteredProducts = [];
  String _selectedCategory = 'all';
  String _searchQuery = '';

  List<Product> get products => _filteredProducts.isEmpty ? _products : _filteredProducts;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;

  // Charger les produits
  Future<void> loadProducts() async {
    try {
      final data = await ApiService.get('/products');
      List<dynamic> productsList;
      
      // Gérer différents formats de réponse
      if (data is List) {
        productsList = data;
      } else if (data['products'] != null) {
        productsList = data['products'] as List;
      } else {
        productsList = [];
      }
      
      _products = productsList
          .map((json) => Product.fromJson(json as Map<String, dynamic>))
          .toList();
      _applyFilters();
      notifyListeners();
    } catch (e) {
      debugPrint('Erreur chargement produits: $e');
      // En cas d'erreur, utiliser des données locales
      _products = _getLocalProducts();
      _applyFilters();
      notifyListeners();
    }
  }

  // Filtrer par catégorie
  void filterByCategory(String category) {
    _selectedCategory = category;
    _applyFilters();
    notifyListeners();
  }

  // Rechercher
  void search(String query) {
    _searchQuery = query.toLowerCase();
    _applyFilters();
    notifyListeners();
  }

  // Appliquer les filtres
  void _applyFilters() {
    _filteredProducts = _products.where((product) {
      // Filtre catégorie
      if (_selectedCategory != 'all') {
        final productCategory = product.category.toLowerCase();
        final selectedCategory = _selectedCategory.toLowerCase();
        if (selectedCategory == 'maillots' && productCategory != 'maillots' && productCategory != 'maillets') {
          return false;
        }
        if (selectedCategory != 'maillots' && productCategory != selectedCategory) {
          return false;
        }
      }

      // Filtre recherche
      if (_searchQuery.isNotEmpty) {
        final nameMatch = product.name.toLowerCase().contains(_searchQuery);
        final categoryMatch = product.category.toLowerCase().contains(_searchQuery);
        if (!nameMatch && !categoryMatch) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  // Produits locaux (fallback)
  List<Product> _getLocalProducts() {
    return [
      Product(
        id: '1',
        name: 'Maillet 24/25 Domicile',
        price: 59000,
        originalPrice: 69000,
        rating: 4.7,
        points: 590,
        category: 'Maillets',
        image: 'images/maillet.jpg',
        isNew: true,
        deliveryFree: true,
      ),
      Product(
        id: '2',
        name: 'Écharpe Gaindé',
        price: 12000,
        rating: 4.6,
        points: 120,
        category: 'Accessoires',
        image: 'images/echarpe.jpg',
        discount: 15,
      ),
    ];
  }
}

