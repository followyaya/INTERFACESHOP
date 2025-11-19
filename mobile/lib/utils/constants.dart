class AppConstants {
  // API
  static const String apiBaseUrl = 'http://localhost:3001/api';
  
  // Pour Android emulator, utiliser 10.0.2.2 au lieu de localhost
  // static const String apiBaseUrl = 'http://10.0.2.2:3001/api';
  
  // Pour iOS simulator, utiliser localhost
  // static const String apiBaseUrl = 'http://localhost:3001/api';
  
  // Pour device physique, utiliser l'IP de votre machine
  // static const String apiBaseUrl = 'http://192.168.1.X:3001/api';

  // Colors
  static const primaryColor = 0xFF667eea;
  static const secondaryColor = 0xFF764ba2;
  static const successColor = 0xFF48bb78;
  static const errorColor = 0xFFff4757;
  
  // Storage keys
  static const String cartStorageKey = 'shop_cart';
  static const String userIdStorageKey = 'shop_user_id';
}

