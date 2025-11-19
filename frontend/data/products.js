const products = [
    {
        id: 1,
        name: "Maillet 24/25 Domicile",
        price: 59000,
        originalPrice: 69000,
        rating: 4.7,
        points: 590,
        category: "Maillets",
        image: "images/maillet.jpg",
        isNew: true,
        discount: null,
        deliveryFree: true
    },
    {
        id: 2,
        name: "Écharpe Gaindé",
        price: 12000,
        originalPrice: null,
        rating: 4.6,
        points: 120,
        category: "Accessoires",
        image: "images/echarpe.jpg",
        isNew: false,
        discount: 15,
        deliveryFree: false
    }
];

window.products = products;