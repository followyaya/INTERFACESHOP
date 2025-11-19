import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import 'api_service.dart';

class CartService extends ChangeNotifier {
  List<CartItem> _items = [];
  static const String _storageKey = 'shop_cart';
  static const String _userIdKey = 'shop_user_id';

  List<CartItem> get items => _items;
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);
  int get total => _items.fold(0, (sum, item) => sum + item.total);

  CartService() {
    _loadCart();
  }

  // Charger le panier depuis localStorage
  Future<void> _loadCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartJson = prefs.getString(_storageKey);
      
      if (cartJson != null) {
        final List<dynamic> cartData = json.decode(cartJson) as List<dynamic>;
        _items = cartData
            .map((json) => CartItem.fromJson(json as Map<String, dynamic>))
            .toList();
        notifyListeners();
      }

      // Essayer de charger depuis l'API
      await _loadCartFromApi();
    } catch (e) {
      debugPrint('Erreur chargement panier: $e');
    }
  }

  // Charger depuis l'API
  Future<void> _loadCartFromApi() async {
    try {
      final data = await ApiService.get('/cart');
      if (data['items'] != null) {
        _items = (data['items'] as List)
            .map((json) => CartItem.fromJson(json as Map<String, dynamic>))
            .toList();
        await _saveCart();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erreur chargement panier API: $e');
      // Continuer avec le panier local si l'API échoue
    }
  }

  // Sauvegarder le panier
  Future<void> _saveCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartJson = json.encode(
        _items.map((item) => item.toJson()).toList(),
      );
      await prefs.setString(_storageKey, cartJson);
    } catch (e) {
      debugPrint('Erreur sauvegarde panier: $e');
    }
  }

  // Ajouter au panier
  Future<void> addToCart(Product product) async {
    try {
      // Essayer l'API d'abord
      await ApiService.post('/cart/add', {
        'productId': product.id,
        'quantity': 1,
      });
      await _loadCartFromApi();
    } catch (e) {
      debugPrint('Erreur API, utilisation locale: $e');
      _addToCartLocal(product);
    }
  }

  // Ajouter localement
  void _addToCartLocal(Product product) {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(
        product: product,
        quantity: 1,
        price: product.price,
      ));
    }

    _saveCart();
    notifyListeners();
  }

  // Mettre à jour la quantité
  Future<void> updateQuantity(String productId, int quantity) async {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      await ApiService.put('/cart/update', {
        'productId': productId,
        'quantity': quantity,
      });
      await _loadCartFromApi();
    } catch (e) {
      debugPrint('Erreur API, utilisation locale: $e');
      _updateQuantityLocal(productId, quantity);
    }
  }

  // Mettre à jour localement
  void _updateQuantityLocal(String productId, int quantity) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      _items[index].quantity = quantity;
      _saveCart();
      notifyListeners();
    }
  }

  // Supprimer un article
  Future<void> removeItem(String productId) async {
    try {
      await ApiService.delete('/cart/remove/$productId');
      await _loadCartFromApi();
    } catch (e) {
      debugPrint('Erreur API, utilisation locale: $e');
      _removeItemLocal(productId);
    }
  }

  // Supprimer localement
  void _removeItemLocal(String productId) {
    _items.removeWhere((item) => item.product.id == productId);
    _saveCart();
    notifyListeners();
  }

  // Vider le panier
  Future<void> clearCart() async {
    _items.clear();
    await _saveCart();
    notifyListeners();
  }
}

