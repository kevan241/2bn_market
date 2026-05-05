const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/images', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('resource_type:image')
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();

        const images = result.resources.map((r) => ({
            public_id: r.public_id,
            secure_url: r.secure_url,
        }));

        res.json({ images });
    } catch (err) {
        res.status(500).json({ error: 'Erreur Cloudinary' });
    }
});

module.exports = router;