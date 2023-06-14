import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NoticeProvider } from './context/NoticeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NoticeProvider>
      <App />
    </NoticeProvider>
  </React.StrictMode>,
)
