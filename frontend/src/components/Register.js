import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async () => {
    try {
      // Validações básicas
      if (!form.name || !form.email || !form.password || !form.password_confirmation) {
        alert('Preencha todos os campos.');
        return;
      }
      if (form.password !== form.password_confirmation) {
        alert('As senhas não coincidem.');
        return;
      }

      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
      };

      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        console.error('Erro no registro:', res.status, data);
        const message = data && data.message ? data.message : JSON.stringify(data);
        alert('Erro ao registrar: ' + message);
        return;
      }

      // Se a API retornar um token, salvar no localStorage para uso posterior
      // Ajuste as chaves conforme a resposta real da sua API (ex: data.token, data.access_token, data.token_type)
      let token = null;
      if (data) {
        token = data.token || data.access_token || (data.data && data.data.token) || null;
        if (token) {
          localStorage.setItem('token', token);
        }
      }

      // Se não recebemos token no cadastro, tentar logar automaticamente
      if (!token) {
        try {
          const loginRes = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email, password: form.password })
          });
          const loginData = await loginRes.json().catch(() => null);
          if (loginRes.ok && loginData) {
            const loginToken = loginData.token || loginData.access_token || (loginData.data && loginData.data.token) || null;
            if (loginToken) {
              localStorage.setItem('token', loginToken);
              token = loginToken;
            }
          } else {
            console.warn('Login automático falhou:', loginRes.status, loginData);
          }
        } catch (err) {
          console.error('Erro no login automático:', err);
        }
      }

      alert('Registro realizado com sucesso!');
      setForm({ name: '', email: '', password: '', password_confirmation: '' });
      console.log('Resposta do registro:', data);

      // Se obtivemos token, redirecionar para criar produto (ou para home)
      if (token) {
        navigate('/api/create-products');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar usuário. Veja o console para detalhes.');
    }
  };

  return (
    <div className="wrapper-register" >
      <h2>Registrar Usuário</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>Nome</label>
        <input type="text" id="name" value={form.name} onChange={handleChange} />

        <label>E-mail</label>
        <input type="email" id="email" value={form.email} onChange={handleChange} />

        <label>Senha</label>
        <input type="password" id="password" value={form.password} onChange={handleChange} />

        <label>Confirmar Senha</label>
        <input type="password" id="password_confirmation" value={form.password_confirmation} onChange={handleChange} />

        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      </div>
    </div>
  );
}

export default Register;