import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ProductAdd from './components/ProductAdd';
import Register from './components/Register';
import ProductEdit from './components/ProductEdit';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="api/login" element={<Login />} />
        <Route path="api/user-register" element={<Register />} />
        <Route path="api/create-products" element={<ProductAdd />} />
        <Route path="api/products/:id/edit" element={<ProductEdit />} />
        <Route path="api/products/" element={<ProductList />} />
        <Route path="api/products/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;