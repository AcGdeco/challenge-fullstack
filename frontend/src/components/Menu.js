import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Menu() {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
  const loggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    navigate('/');
    // force reload so menu re-evaluates logged state
    window.location.reload();
  };

  return (
    <div className="wrapper-menu">
      <div className="left-group">
        <div className="btn-home btn-menu"><Link to={'/'}>Home</Link></div>
        {loggedIn && (
          <>
            <div className="btn-criar btn-menu"><Link to={'/api/create-products'}>Criar</Link></div>
            <div className="btn-produtos btn-menu"><Link to={'/api/products'}>Produtos</Link></div>
          </>
        )}
      </div>
      <div className="right-group">
        {!loggedIn ? (
          <>
            <div className="btn-login btn-menu"><Link to={'/api/login'}>Login</Link></div>
            <div className="btn-register btn-menu"><Link to={'/api/user-register'}>Registrar</Link></div>
          </>
        ) : (
          <div className="btn-logout btn-menu">
            <button onClick={handleLogout} className="btn-primary">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;