import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // From @tanstack/react-query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional devtools

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

// Hydrate if the markup was prerendered (e.g. by react-snap), otherwise render
// normally. This keeps the app prerender/SSG-ready without breaking CSR.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
