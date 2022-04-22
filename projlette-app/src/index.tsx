import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
// @ts-ignore
import App from './components/App.tsx';
// @ts-ignore
import reportWebVitals from './reportWebVitals.ts';

// TODO: Set this to true when deploying to production
export const PRODUCTION_MODE = false;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
