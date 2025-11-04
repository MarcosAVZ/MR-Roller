import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            🪟 MR Roller
          </Link>
        </div>

        <div className="nav-menu">
          <Link 
            to="/cortinas" 
            className={`nav-link ${location.pathname === '/cortinas' ? 'active' : ''}`}
          >
            🪟 Cortinas
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            ⚙️ Administración
          </Link>
        </div>

        <div className="nav-actions">
          <button className="cart-button">
            🛒 Carrito (0)
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
