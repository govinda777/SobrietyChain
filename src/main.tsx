import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from 'thirdweb/react';
import { SobrietyProvider } from './context/SobrietyContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <SobrietyProvider>
        <App />
      </SobrietyProvider>
    </ThirdwebProvider>
  </React.StrictMode>,
);
