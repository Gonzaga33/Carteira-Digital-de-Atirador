import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicializador from './Inicializador.jsx'
import LimiteDeErro from './LimiteDeErro.jsx'
import { registrarServiceWorker } from './pwa/registrarSW.js'

registrarServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LimiteDeErro>
      <Inicializador />
    </LimiteDeErro>
  </StrictMode>,
)
