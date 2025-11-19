import React, { useState } from 'react';

function ProductAdd() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      // validações: name obrigatório
      if (!form.name || !form.name.trim()) {
        alert('O campo Nome é obrigatório.');
        return;
      }

      // price obrigatório e > 0
      const priceNum = parseFloat(String(form.price).replace(',', '.'));
      if (isNaN(priceNum) || priceNum <= 0) {
        alert('O campo Preço é obrigatório e deve ser um número maior que 0.');
        return;
      }

      // quantity obrigatório e inteiro
      const quantityNum = Number(form.quantity);
      if (form.quantity === '' || !Number.isInteger(quantityNum) || isNaN(quantityNum) || quantityNum < 0) {
        alert('O campo Quantidade é obrigatório e deve ser um número inteiro (>= 0).');
        return;
      }

      const body = {
        name: form.name.trim(),
        description: form.description ? String(form.description).trim() : '',
        price: priceNum,
        quantity: quantityNum
      };

      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login antes de cadastrar um produto.');
        return;
      }

      const res = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }

      let data = null;
      try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
      alert('Produto salvo com sucesso!');
      setForm({ name: '', description: '', price: '', quantity: '' });
      console.log('Resposta da API:', data);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto. Veja o console para detalhes.');
    }
  };

  return (
    <div className="wrapper-product-details" >
      <table className="product-details" >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" id="name" value={form.name} onChange={handleChange} /></td>
            <td><input type="text" id="price" value={form.price} onChange={handleChange} /></td>
            <td><input type="text" id="quantity" value={form.quantity} onChange={handleChange} /></td>
          </tr>
          <tr>
            <th colSpan="3">Descrição</th>
          </tr>
          <tr>
            <td colSpan="3"><input type="text" id="description" value={form.description} onChange={handleChange} /></td>
          </tr>
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', paddingTop: '10px' }}>
                <button className="btn-primary" onClick={handleSave}>Salvar</button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductAdd;