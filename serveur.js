const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/kabaconde', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB local'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));
// Modèle d'actualité
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