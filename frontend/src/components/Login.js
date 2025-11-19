import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        alert('Preencha e-mail e senha.');
        return;
      }

      const body = { email: form.email, password: form.password };

      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = data && data.message ? data.message : JSON.stringify(data);
        alert('Erro no login: ' + message);
        console.error('Erro no login:', res.status, data);
        return;
      }

      // salvar token retornado pela API
      const token = data && (data.token || data.access_token || (data.data && data.data.token));
      if (token) {
        localStorage.setItem('token', token);
      }

      alert('Login realizado com sucesso!');
      setForm({ email: '', password: '' });
      console.log('Resposta do login:', data);

      // Redirecionar para a home e recarregar para que o Menu perceba o novo estado
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer login. Veja o console para detalhes.');
    }
  };

  return (
    <div className="wrapper-register" >
      <h2>Entrar</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <label>E-mail</label>
        <input type="email" id="email" value={form.email} onChange={handleChange} />

        <label>Senha</label>
        <input type="password" id="password" value={form.password} onChange={handleChange} />

        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <button onClick={handleLogin}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

export default Login;