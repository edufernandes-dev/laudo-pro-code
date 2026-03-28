import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../hooks/useAuth'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useState } from 'react'

export function Header() {
  const isOnline = useOnlineStatus()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
        <span>📋</span>
        <span>Laudo Pro</span>
      </Link>

      <div className="flex items-center gap-3">
        <span
          className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-yellow-400'}`}
          title={isOnline ? 'Online' : 'Offline'}
        />

        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-sm font-bold"
          >
            E
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-lg shadow-xl w-40 py-1 z-50">
              <Link
                to="/perfil"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
