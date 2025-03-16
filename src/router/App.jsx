import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AdminRouter from './AdminRouter';
import Userouter from './Userouter';
function App() {
  return (
    <Provider store={store}>
      <AdminRouter />
      <Userouter />
    </Provider>
  );
}

export default App;