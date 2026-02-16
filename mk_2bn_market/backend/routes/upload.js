const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.get('/', (req, res) => {
  res.json({ message: 'Route /api/upload fonctionne ! Utilisez POST pour uploader.' });
});

router.post('/', async (req, res) => { 
  console.log('📥 Upload reçu !');
  console.log('📁 Files:', req.files);
  console.log('📦 Body:', req.body);
  
  try {
    if (!req.files || !req.files.file) {
      console.log('❌ Pas de fichier');
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const file = req.files.file;
    const category = req.body.category || 'Autres';
    
    console.log('📂 Catégorie:', category);
    
    const targetDir = path.join(__dirname, '../public/uploads', category);
    console.log('📍 Dossier cible:', targetDir);
    
    if (!fs.existsSync(targetDir)) {
      console.log('📁 Création du dossier:', targetDir);
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = Date.now() + '-' + file.name;
    const filePath = path.join(targetDir, fileName);
    
    console.log('💾 Sauvegarde:', filePath);
    await file.mv(filePath);  // ← Ajoute await

    const fileUrl = `https://twobn-market.onrender.com/uploads/${category}/${fileName}`;
    console.log('✅ Upload réussi:', fileUrl);

    res.json({
      success: true,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;