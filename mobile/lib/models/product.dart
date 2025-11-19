class Product {
  final String id;
  final String name;
  final int price;
  final int? originalPrice;
  final double rating;
  final int points;
  final String category;
  final String? image;
  final bool isNew;
  final int? discount;
  final bool deliveryFree;
  final String? description;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.originalPrice,
    required this.rating,
    required this.points,
    required this.category,
    this.image,
    this.isNew = false,
    this.discount,
    this.deliveryFree = false,
    this.description,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      price: json['price'] ?? 0,
      originalPrice: json['originalPrice'],
      rating: (json['rating'] ?? 0).toDouble(),
      points: json['points'] ?? 0,
      category: json['category'] ?? '',
      image: json['image'],
      isNew: json['isNew'] ?? false,
      discount: json['discount'],
      deliveryFree: json['deliveryFree'] ?? false,
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'originalPrice': originalPrice,
      'rating': rating,
      'points': points,
      'category': category,
      'image': image,
      'isNew': isNew,
      'discount': discount,
      'deliveryFree': deliveryFree,
      'description': description,
    };
  }
}

