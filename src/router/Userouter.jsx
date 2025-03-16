import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../page/user/Home';

const Userouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
        
            </Routes>
        </Router>
    );
};

export default Userouter;