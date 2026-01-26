const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'admin existe
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Crée un token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'votre_secret_jwt_temporaire',
      { expiresIn: '24h' }
    );

    // Retourne le token et les infos admin
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour créer un admin (à utiliser UNE SEULE FOIS)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Vérifie si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Cet email existe déjà' });
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      name
    });

    await admin.save();

    res.status(201).json({ message: 'Admin créé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;