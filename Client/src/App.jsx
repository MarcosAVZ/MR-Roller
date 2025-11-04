import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import CortinasPage from './pages/CortinasPage.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import CortinaDetailPage from './pages/CortinaDetailPage.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/cortinas" replace />} />
            <Route path="/cortinas" element={<CortinasPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/cortinas/:id" element={<CortinaDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
