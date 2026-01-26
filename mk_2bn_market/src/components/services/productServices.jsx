export const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        return [];
    }
}

export const getProductById = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        return null;
    }
}