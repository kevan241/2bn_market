const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const productsData = [   
    {
        image: "./img/formation_img/word.jpg",
        name: "Les bases d'excel",  
        notice: 'Paiement via airtel money / mobile cash',
        description: "Lorem ipsum dolor abeset description random Lorem ipsum dolor abeset description random",
        price: "20000 Fcfa",
        categories: "Documents"
    },
    {
        image: "./img/formation_img/word.jpg",
        name: "Les bases de Word",
        notice: 'Paiement via airtel money / mobile cash',
        description: "Lorem ipsum dolor abeset description random Lorem ipsum dolor abeset description random",
        price: "50000 Fcfa",
        categories: "Documents"
    },
    {
        image: "./img/formation_img/word.jpg",
        name: "Monter un business plan",
        notice: 'Paiement via airtel money / mobile cash',
        description: "Lorem ipsum dolor abeset description random Lorem ipsum dolor abeset description random",
        price: "15000 Fcfa",
        categories: "Documents"
    },
    {
        image: "./img/formation_img/word.jpg",
        name: "Organiser son projet avec Trello",
        notice: 'Paiement via airtel money / mobile cash',
        description: "Lorem ipsum dolor abeset description random Lorem ipsum dolor abeset description random",
        price: "10000 Fcfa",
        categories: "Documents"
    }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    await Product.deleteMany({});
    console.log('Anciens produits supprimés');

    await Product.insertMany(productsData);
    console.log('4 produits insérés avec succès');
    
    process.exit();
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();