// server/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes API
app.use('/api/tracking', require('./api/tracking'));

// Route pour la page d'administration des stats
app.get('/admin/stats', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/stats.html'));
});

// Route par défaut - servir votre site
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 API Tracking: http://localhost:${PORT}/api/tracking`);
  console.log(`👨‍💻 Admin Stats: http://localhost:${PORT}/admin/stats`);
});
