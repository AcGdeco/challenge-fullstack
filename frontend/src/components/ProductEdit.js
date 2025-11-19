import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          quantity: p.quantity || p.qty || ''
        });
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        alert('Não foi possível carregar os dados do produto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { id: key, value } = e.target;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    // validações
    if (!form.name || !form.name.trim()) {
      alert('O campo Nome é obrigatório.');
      return;
    }

    const priceNum = parseFloat(String(form.price).replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('O campo Preço é obrigatório e deve ser um número maior que 0.');
      return;
    }

    const quantityNum = Number(form.quantity);
    if (form.quantity === '' || !Number.isInteger(quantityNum) || isNaN(quantityNum) || quantityNum < 0) {
      alert('O campo Quantidade é obrigatório e deve ser um número inteiro (>= 0).');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const body = { name: form.name.trim(), description: form.description ? String(form.description).trim() : '', price: priceNum, quantity: quantityNum };
      await axios.put(`http://127.0.0.1:8000/api/products/${id}`, body, { headers });
      alert('Produto atualizado com sucesso!');
      navigate('/api/products');
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      alert('Erro ao atualizar produto. Veja o console para detalhes.');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="wrapper-product-details">
      <h2>Editar Produto</h2>
      <table className="product-details">
        <tbody>
          <tr>
            <td>Nome</td>
            <td><input type="text" id="name" value={form.name} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Preço</td>
            <td><input type="text" id="price" value={form.price} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Quantidade</td>
            <td><input type="text" id="quantity" value={form.quantity} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Descrição</td>
            <td><input type="text" id="description" value={form.description} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
              <button className="btn-primary" onClick={handleSave}>Salvar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductEdit;
