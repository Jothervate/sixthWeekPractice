import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx'
import "./assets/all.scss"
import './assets/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/fifthWeekPractice">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
