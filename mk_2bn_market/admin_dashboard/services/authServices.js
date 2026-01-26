// Fonction pour se connecter
export const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Si la requête a échoué
        if (!response.ok) {
            throw new Error(data.message || 'Erreur de connexion');
        }

        return data; // Retourne les données (token, user, etc.)
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error; // Propage l'erreur pour la gérer dans le composant
    }
};