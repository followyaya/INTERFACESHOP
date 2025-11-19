class Formatters {
  // Formater le prix
  static String formatPrice(int price) {
    return price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]} ',
    );
  }

  // Formater le prix avec FCFA
  static String formatPriceWithCurrency(int price) {
    return '${formatPrice(price)} FCFA';
  }
}

