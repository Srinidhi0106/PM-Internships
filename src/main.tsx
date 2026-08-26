import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { TimezoneProvider } from './context/TimezoneContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <TimezoneProvider>
          <App />
        </TimezoneProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);

