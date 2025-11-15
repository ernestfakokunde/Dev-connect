import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'
import './global.css'
import App from './App.jsx'
import { GlobalProvider } from './context/context.jsx'
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <GlobalProvider>
      <SocketProvider>
      <App />
      </SocketProvider>
      </GlobalProvider>
    </BrowserRouter>
);
