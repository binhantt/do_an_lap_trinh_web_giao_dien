import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../page/user/Home';
import CategoryPage from '../page/user/CategoryPage';
import OrderDetailPage from '../page/user/OrderDetailPage';
import ProductDetail from '../page/user/ProductDetail';
import Login from '../page/auth/Login';
import Register from '../page/auth/Register';
import Profile from '../page/user/Profile';

const Userouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/order/:orderId" element={<OrderDetailPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path='/login' element={<Login/>} />
                // Add this to your routes
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default Userouter;