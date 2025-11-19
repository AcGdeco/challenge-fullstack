import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar este produto?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, { headers });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      alert('Erro ao deletar produto. Veja o console para mais detalhes.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="wrapper-product-list" >
      <table className="product-list" >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <Link to={'/api/products/'+product.id} className="action-btn details">Detalhes</Link>
                <Link to={'/api/products/'+product.id+'/edit'} className="action-btn edit">Editar</Link>
                <button onClick={() => handleDelete(product.id)} className="action-btn delete">Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;