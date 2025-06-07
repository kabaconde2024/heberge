const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_USER = 'kabaconde';
const MONGODB_PASSWORD = 'g63yQnrdf2dP0MLU'; // À CHANGER IMMÉDIATEMENT
const MONGODB_CLUSTER = 'cluster0.rpsw8o8'; // Nom réel de votre cluster
const MONGODB_DBNAME = 'kabaconde';

// Construction de l'URI
const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;

// Connexion à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas (Cluster0.rpsw8o8)'))
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  });

  
const Actualite = require('./models/Actualite');

// API Routes
app.get('/api/actualites', async (req, res) => {
    try {
        const actualites = await Actualite.find().sort({ dateCreation: -1 });
        res.json(actualites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/actualites', async (req, res) => {
    try {
        const { titre, contenu } = req.body;
        const nouvelleActualite = new Actualite({
            titre,
            contenu,
            dateCreation: new Date()
        });
        await nouvelleActualite.save();
        res.status(201).json(nouvelleActualite);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'actualité' });
    }
});

// Routes pour les pages HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/actualites', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'actualites.html'));
});

app.get('/ajouter-actualite', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ajouter-actualite.html'));
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});