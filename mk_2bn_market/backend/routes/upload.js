const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { v2: cloudinary } = require('cloudinary');

router.use(fileUpload());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'Aucun fichier fourni' });
        }

        const file = req.files.file;

        // Upload direct sur Cloudinary via buffer
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(file.data);
        });

        res.json({
            success: true,
            fileUrl: result.secure_url,
        });

    } catch (error) {
        console.error('❌ Erreur upload:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;