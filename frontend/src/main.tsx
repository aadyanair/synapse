import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { FolderProvider } from './context/FolderContext'
import { TodoProvider } from './context/TodoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FolderProvider>
          <TodoProvider>
            <App />
          </TodoProvider>
        </FolderProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
