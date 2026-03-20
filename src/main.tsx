import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { saveToStorage } from '@/utils/localStorage';
import './styles/global.scss';
import './index.css';
import App from './App.tsx';

// Persist pageSize to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveToStorage('pageSize', state.products.pageSize);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
