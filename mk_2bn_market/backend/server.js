require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/database');

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://2bn-market-55ud.vercel.app' ],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ✅ express.json() EN PREMIER
app.use(express.json());

// ✅ fileUpload seulement pour /api/upload


app.use('/uploads', express.static('public/uploads'));

// Routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payment');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API MK_2BN Market fonctionnelle !' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});