import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </Router>
    </ErrorBoundary>
  )
}

export default App
