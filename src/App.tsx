// KISS: Simple router setup
// SOLID: Open/Closed - add routes without modifying existing components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ScoringMethod from './pages/ScoringMethod'
import Login from './pages/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './auth/AuthContext'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/scoring-method" 
                element={
                  <ProtectedRoute>
                    <ScoringMethod />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
