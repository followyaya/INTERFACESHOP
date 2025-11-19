import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class ApiService {
  static String? userId;

  // Obtenir ou créer un userId
  static Future<String> getUserId() async {
    if (userId != null) return userId!;
    // Le userId sera géré par le backend via les headers
    // Pour la persistance, on pourrait utiliser SharedPreferences
    userId = 'mobile-user-${DateTime.now().millisecondsSinceEpoch}';
    return userId!;
  }

  // Headers communs
  static Future<Map<String, String>> getHeaders() async {
    final uid = await getUserId();
    return {
      'Content-Type': 'application/json',
      'user-id': uid,
    };
  }

  // GET request
  static Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
        headers: await getHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // POST request
  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
        headers: await getHeaders(),
        body: json.encode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to post: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // PUT request
  static Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
        headers: await getHeaders(),
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to put: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // DELETE request
  static Future<void> delete(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.apiBaseUrl}$endpoint'),
        headers: await getHeaders(),
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}

