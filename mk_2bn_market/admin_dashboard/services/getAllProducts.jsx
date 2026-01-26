
// Récupérer tous les produits
export const getAllProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products');
  return await response.json();
};

// Modifier un produit
export const updateProduct = async (id, data) => {
  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
};

/* supprimer un produit*/
export const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return await response.json();
};

/* supprimer un produit*/

export const uploadFile = async (file, category) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'upload');
  }

  return response.json();
};