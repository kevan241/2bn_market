const API_URL = 'http://localhost:5000/api/products';

// Créer un produit
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création');
    }

    return data;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur');
    }

    return data;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur');
    }

    return data;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};