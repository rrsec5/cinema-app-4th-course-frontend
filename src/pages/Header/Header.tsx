import { NavLink } from 'react-router-dom'

import { FaFilm, FaTicketAlt, FaCreditCard, FaHome } from 'react-icons/fa'

// ============ Header Component ============
export const Header = () => {
  return (
    <header className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition"
          >
            <FaFilm className="text-3xl" />
            <span>Cinema Management</span>
          </NavLink>

          <nav className="flex space-x-6">
            <NavLink
              to="/"
              className="flex items-center space-x-1 hover:text-blue-700 transition"
            >
              <FaHome />
              <span>Movies</span>
            </NavLink>
            <NavLink
              to="/bookings"
              className="flex items-center space-x-1 hover:text-blue-200 transition"
            >
              <FaTicketAlt />
              <span>Bookings</span>
            </NavLink>
            <NavLink
              to="/payments"
              className="flex items-center space-x-1 hover:text-blue-200 transition"
            >
              <FaCreditCard />
              <span>Payments</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
