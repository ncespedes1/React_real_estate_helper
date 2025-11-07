import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { LocationDataProvider } from './contexts/LocationDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LocationDataProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LocationDataProvider>
    </AuthProvider>
  </StrictMode>
)
