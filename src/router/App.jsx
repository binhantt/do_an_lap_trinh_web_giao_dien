import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AdminRouter from './AdminRouter';

function App() {
  return (
    <Provider store={store}>
      <AdminRouter />
    </Provider>
  );
}

export default App;