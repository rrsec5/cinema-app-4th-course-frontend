import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Booking, Movie, Session } from '../../interfaces/interfaces'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { LoadingSpinner } from '../../components/UI/LoadingSpinner'

// ============ Booking Detail Page ============
export const BookingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking>()
  const [bookingSession, setBookingSession] = useState<Session>()
  const [sessionMovie, setSessionMovie] = useState<Movie>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)

        const bookingResp = await api.get(`/api/bookings/${id}`)
        const bookingData: Booking = bookingResp.data
        setBooking(bookingData)

        const sessionResp = await api.get(
          `/api/movies/sessions/${bookingData.sessionId}`,
        )
        const sessionData: Session = sessionResp.data
        setBookingSession(sessionData)

        const movieResp = await api.get(`/api/movies/${sessionData.movieId}`)
        setSessionMovie(movieResp.data)
      } catch (err) {
        handleApiError(err, 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!booking)
    return <div className="text-center py-12">Booking not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              booking.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-800'
                : booking.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Name:</span>{' '}
                {booking.customerName}
              </div>
              <div>
                <span className="font-medium">Email:</span>{' '}
                {booking.customerEmail}
              </div>
              <div>
                <span className="font-medium">User ID:</span> {booking.userId}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Booking ID:</span> {booking.id}
              </div>
              <div>
                <span className="font-medium">Session ID:</span>{' '}
                {booking.sessionId}
              </div>
              <div>
                <span className="font-medium">Created At:</span>{' '}
                {new Date(booking.createdAt).toLocaleString()}
              </div>
              {booking.expiresAt && (
                <div>
                  <span className="font-medium">Expires At:</span>{' '}
                  {new Date(booking.expiresAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {bookingSession && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Session Information
              </h2>

              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <span className="font-medium">Movie:</span>{' '}
                  {sessionMovie?.title}
                </div>
                <div>
                  <span className="font-medium">Hall:</span>{' '}
                  {bookingSession.hallId}
                </div>
                <div>
                  <span className="font-medium">Available Seats:</span>{' '}
                  {bookingSession.availableSeats}
                </div>
                <div>
                  <span className="font-medium">Price:</span>{' '}
                  {bookingSession.price.value} {bookingSession.price.currency}
                </div>
                <div>
                  <span className="font-medium">Start:</span>{' '}
                  {new Date(bookingSession.startTime).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Seats</h2>
            <div className="flex flex-wrap gap-2">
              {booking.seats?.map((seat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg"
                >
                  Row {seat.row}, Seat {seat.number}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="text-2xl font-bold text-green-600">
              {booking.totalPrice?.value} {booking.totalPrice?.currency}
            </div>
            {booking.status === 'CONFIRMED' && (
              <button
                onClick={() =>
                  navigate(`/payments/create?bookingId=${booking.id}`)
                }
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Process Payment
              </button>
            )}
          </div>

          {booking.notes && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Notes</h2>
              <p className="text-gray-700">{booking.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={() => navigate('/bookings')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Bookings
            </button>
            <button
              onClick={() => navigate(`/bookings/${id}/edit`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
