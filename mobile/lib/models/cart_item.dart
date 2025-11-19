import 'product.dart';

class CartItem {
  final Product product;
  int quantity;
  final int price;

  CartItem({
    required this.product,
    required this.quantity,
    required this.price,
  });

  int get total => price * quantity;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      product: Product.fromJson(json['product'] ?? {}),
      quantity: json['quantity'] ?? 1,
      price: json['price'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'product': product.toJson(),
      'quantity': quantity,
      'price': price,
    };
  }
}

