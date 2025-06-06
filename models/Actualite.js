const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    contenu: {
        type: String,
        required: true
    },
    dateCreation: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Actualite', actualiteSchema);