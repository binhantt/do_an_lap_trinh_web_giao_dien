import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../components/RouteGuards';
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
                <Route path="/product/:productname" element={<ProductDetail />} />
                
                {/* Auth routes with redirect if already logged in */}
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />

                {/* Protected routes */}
                <Route path="/profile/:name" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/order/:orderId" element={
                    <PrivateRoute>
                        <OrderDetailPage />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
};

export default Userouter;