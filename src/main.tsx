import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RSA from './RSA.tsx'
import AppHybrid from './AppHybrid.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <RSA />
    <AppHybrid />
  </StrictMode>,
)
