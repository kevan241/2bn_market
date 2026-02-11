const mongoose = require('mongoose'); //j'importe le module de mongoose que j'ai installer dans le projet et je l'attribu a la variable mongoose.

const connectDB = async () => { // je crée la fonction connectDB pour me connecter a ma bdd dans mon await je me connect a ma bdd mongooe en donnant le chemin du lien qui mene a ma bdd qui contient mes identifiants de connexion
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté avec succès');//si connecté j'affiche ce message
  } catch (error) { // catch sert a detecter les erreur autotomatiquement, j'aurais pu mettre un autre texte que error comme echec ou autre mais error est conform aux standard
    console.error('Erreur de connexion MongoDB:', error.message);// ce message s'affiche si la connection echoue
    process.exit(1); 
  }
};

module.exports = connectDB;