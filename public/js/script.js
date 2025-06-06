// Fonction pour charger les actualités
async function chargerActualites() {
    if (document.getElementById('actualites-list')) {
        try {
            const response = await fetch('/api/actualites');
            const actualites = await response.json();
            
            const actualitesList = document.getElementById('actualites-list');
            
            if (actualites.length > 0) {
                actualitesList.innerHTML = '';
                actualites.forEach(actualite => {
                    const date = new Date(actualite.dateCreation).toLocaleDateString();
                    actualitesList.innerHTML += `
                        <article class="actualite">
                            <h3>${actualite.titre}</h3>
                            <p>${actualite.contenu}</p>
                            <small>Publié le ${date}</small>
                        </article>
                    `;
                });
            } else {
                actualitesList.innerHTML = '<p>Aucune actualité pour le moment.</p>';
            }
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('actualites-list').innerHTML = 
                '<p class="error">Erreur lors du chargement des actualités</p>';
        }
    }
}

// Gestion du formulaire d'ajout d'actualité
if (document.getElementById('form-actualite')) {
    document.getElementById('form-actualite').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titre = document.getElementById('titre').value;
        const contenu = document.getElementById('contenu').value;
        const messageDiv = document.getElementById('message');
        
        try {
            const response = await fetch('/api/actualites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titre, contenu }),
            });
            
            if (response.ok) {
                messageDiv.innerHTML = '<p class="success">Actualité ajoutée avec succès!</p>';
                document.getElementById('form-actualite').reset();
                // Redirection après 2 secondes
                setTimeout(() => {
                    window.location.href = '/actualites';
                }, 2000);
            } else {
                throw new Error('Erreur lors de l\'ajout');
            }
        } catch (error) {
            console.error('Erreur:', error);
            messageDiv.innerHTML = '<p class="error">Erreur lors de l\'ajout de l\'actualité</p>';
        }
    });
}

// Charger les actualités au chargement de la page
document.addEventListener('DOMContentLoaded', chargerActualites);