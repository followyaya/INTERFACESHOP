const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
    {
        name: "Maillet 24/25 Domicile",
        price: 59000,
        originalPrice: 69000,
        rating: 4.7,
        points: 590,
        category: "Maillets",
        image: "images/maillet.jpg",
        isNew: true,
        discount: null,
        deliveryFree: true,
        stock: 50
    },
    {
        name: "Écharpe Gaindé",
        price: 12000,
        originalPrice: 14000,
        rating: 4.6,
        points: 120,
        category: "Accessoires",
        image: "https://www.google.com/imgres?q=%C3%89charpe%20Gaind%C3%A9%20senegal&imgurl=https%3A%2F%2Fsn.jumia.is%2Funsafe%2Ffit-in%2F500x500%2Ffilters%3Afill(white)%2Fproduct%2F05%2F4811%2F1.jpg%3F4979&imgrefurl=https%3A%2F%2Fwww.jumia.sn%2Fgeneric-echarpe-banderole-senegal-en-coton-dimension-140-x-18-cm-118450.html%3Fsrsltid%3DAfmBOopm5VGtJ_Mi-VuUzTtf5BkL8acAQzWS5vyP0IO1h2t5Uj_Aq97P&docid=wIELZbjcN69FlM&tbnid=l5IPL1KlK6TgvM&vet=12ahUKEwiCgYbl4_yQAxUfzwIHHdp-EXAQM3oECCoQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwiCgYbl4_yQAxUfzwIHHdp-EXAQM3oECCoQAA",
        isNew: false,
        discount: 15,
        deliveryFree: false,
        stock: 100
    },
    {
        name: "Ballon Officiel",
        price: 25000,
        originalPrice: 30000,
        rating: 4.8,
        points: 250,
        category: "Accessoires",
        image: "images/ballon.jpg",
        isNew: true,
        discount: 17,
        deliveryFree: true,
        stock: 30
    },
    {
        name: "Maillot Enfant",
        price: 15000,
        originalPrice: 18000,
        rating: 4.5,
        points: 150,
        category: "Enfant",
        image: "images/maillot-enfant.jpg",
        isNew: false,
        discount: 10,
        deliveryFree: false,
        stock: 75
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');
        
        await Product.deleteMany({});
        await Product.insertMany(products);
        
        console.log('✅ Base de données peuplée avec succès');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

seedDatabase();