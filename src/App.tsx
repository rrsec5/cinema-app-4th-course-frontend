import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './pages/Header/Header'
import { CustomToaster } from './components/UI/CustomToaster'
import { MoviesListPage } from './pages/Movies/MoviesList'
import { MovieFormPage } from './pages/Movies/MovieForm'
import { MovieDetailPage } from './pages/Movies/MovieDetails'
import { BookingsListPage } from './pages/Bookings/BookingList'
import { BookingDetailPage } from './pages/Bookings/BookingDetails'
import { BookingFormPage } from './pages/Bookings/BookingForm'
import { SessionFormPage } from './pages/Sessions/SessionForm'
import { PaymentsListPage } from './pages/Payments/PaymentList'
import { CreatePaymentPage } from './pages/Payments/PaymentForm'

// ============ Main App Component ============
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CustomToaster />
        <Routes>
          {/* Movies Routes */}
          <Route path="/" element={<MoviesListPage />} />
          <Route path="/movies" element={<MoviesListPage />} />
          <Route path="/movies/create" element={<MovieFormPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/movies/:id/edit" element={<MovieFormPage />} />

          <Route path="/bookings" element={<BookingsListPage />} />
          <Route path="/bookings/create" element={<BookingFormPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/bookings/:id/edit" element={<BookingFormPage />} />

          <Route path="/sessions/create" element={<SessionFormPage />} />
          <Route path="/sessions/:id/edit" element={<SessionFormPage />} />

          <Route path="/payments" element={<PaymentsListPage />} />
          <Route path="/payments/create" element={<CreatePaymentPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
