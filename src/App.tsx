// KISS: Simple router setup with code splitting
// SOLID: Open/Closed - add routes without modifying existing components
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './auth/AuthContext'
import { LoadingSpinner } from './components/ui'
import { TooltipProvider } from './components/ui/tooltip'
// Lazy load pages for code splitting (performance optimization)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ScoringMethod = lazy(() => import('./pages/ScoringMethod'))
const PlayerPerformance = lazy(() => import('./pages/PlayerPerformance'))
const KeeperPerformance = lazy(() => import('./pages/KeeperPerformance'))

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-legacy-bg-primary)' }}>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Suspense fallback={<LoadingSpinner />}>
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
                  <Route 
                    path="/player-performance" 
                    element={
                      <ProtectedRoute>
                        <PlayerPerformance />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/keeper-performance" 
                    element={
                      <ProtectedRoute>
                        <KeeperPerformance />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </AuthProvider>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App
