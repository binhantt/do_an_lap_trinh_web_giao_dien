import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../components/RouteGuards';
import Home from '../page/user/Home';
import CategoryPage from '../page/user/CategoryPage';

import ProductDetail from '../page/user/ProductDetail';
import Login from '../page/auth/Login';
import Register from '../page/auth/Register';
import Profile from '../page/user/Profile';
import OrderPage from '../page/user/OrderPage'; // Import the new OrderPage component

const Userouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:productname" element={<ProductDetail />} />
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
                <Route path="/profile/:fullname" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                {/* <Route path="/order/:orderId" element={ // Ensure the route matches the order link
                    <PrivateRoute>
                        <OrderPage />
                    </PrivateRoute>
                } /> */}
            </Routes>
        </Router>
    );
};

export default Userouter;