// 1. IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const threatRoutes = require('./routes/threatRoutes');   // 🔥 Import safe hai

// 2. CONFIGURATION
dotenv.config();
const app = express();

// 3. MIDDLEWARE
// Yeh aapke frontend ko backend se connect hone ki permission dega
app.use(cors());
app.use(express.json());

// 4. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', threatRoutes);   // 🔥 Ab yeh route successfully register ho gaya hai!

// Test Route
app.get('/', (req, res) => {
  res.json({
    message: 'TruthGuard API is running successfully! 🚀🛡️'
  });
});

// 5. MONGODB CONNECTION
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to TruthGuard Vault'))
  .catch((err) => console.error('❌ Database connection error:', err));

// 6. START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});