import React from 'react';
import ReactDOM from 'react-dom/client';

// react-redux & react-persist
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// mui
import { CssBaseline } from '@mui/material';

import App from './App';

import store from './store/index';

const persistor = persistStore(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <App />
    </PersistGate>
  </Provider>,
);
