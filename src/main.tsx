import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Privacy } from './Privacy.tsx'
import { Help } from './Help.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
