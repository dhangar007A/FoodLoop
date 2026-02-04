import React, { useEffect } from 'react'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  // Initialize theme from localStorage on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && savedTheme !== 'system') {
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
