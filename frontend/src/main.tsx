import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/plus-jakarta-sans';
import './styles/globals.css';

import { App } from './app/App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Fitency could not start: #root element is missing from index.html.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
