import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/product_service.dart';

class CategoryFilter extends StatelessWidget {
  const CategoryFilter({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = ['Tous', 'Maillots', 'Accessoires', 'Enfant'];
    
    return Consumer<ProductService>(
      builder: (context, productService, child) {
        return Container(
          height: 50,
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              final isSelected = productService.selectedCategory == 
                  (category == 'Tous' ? 'all' : category.toLowerCase());
              
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(category),
                  selected: isSelected,
                  onSelected: (selected) {
                    productService.filterByCategory(
                      category == 'Tous' ? 'all' : category.toLowerCase(),
                    );
                  },
                  selectedColor: const Color(0xFF667eea),
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : Colors.black87,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}

