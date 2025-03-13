import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { checkAuthState } from './redux/auth/authAPI';

// Update Ant Design CSS import
import 'antd/dist/antd.css'; // For Ant Design v4


import AdminLogin from '../src/page/AdminLogin';
import AdminDashboard from './page/AdminDashboard';
import './index.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        {/* Add your other routes here */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;