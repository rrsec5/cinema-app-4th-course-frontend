import { useCallback, useEffect, useState } from 'react'
import type { Booking } from '../../interfaces/interfaces'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { toast } from 'sonner'
import { FaPlus, FaTicketAlt } from 'react-icons/fa'
import { LoadingSpinner } from '../../components/UI/LoadingSpinner'
import { BookingCard } from '../../components/booking/BookingCard'

// ============ Bookings List Page ============
export const BookingsListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const navigate = useNavigate()

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const url = filterStatus
        ? `/api/bookings?status=${filterStatus}`
        : '/api/bookings'
      const response = await api.get(url)
      setBookings(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await api.patch(`/api/bookings/${id}/cancel`)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (err) {
      handleApiError(err, 'Failed to cancel booking')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return

    try {
      await api.delete(`/api/bookings/${id}`)
      toast.success('Booking deleted successfully')
      fetchBookings()
    } catch (err) {
      handleApiError(err, 'Failed to delete booking')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
        <button
          onClick={() => navigate('/bookings/create')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>New Booking</span>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking: Booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  handleCancel={handleCancel}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
