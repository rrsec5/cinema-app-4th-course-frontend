import { useNavigate } from 'react-router-dom'
import type { Booking } from '../../interfaces/interfaces'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

type BookingCardProps = {
  booking: Booking
  handleCancel: (value: string) => void
  handleDelete: (value: string) => void
}

// ============ Booking Card Component ============
export const BookingCard = ({
  booking,
  handleCancel,
  handleDelete,
}: BookingCardProps) => {
  const navigate = useNavigate()

  return (
    <tr key={booking.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {booking.customerName}
        </div>
        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{booking.sessionId}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {booking.seats?.length || 0}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {booking.totalPrice?.value} {booking.totalPrice?.currency}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            booking.status === 'CONFIRMED'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {booking.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm space-x-4">
        <button
          onClick={() => navigate(`/bookings/${booking.id}`)}
          className="text-blue-600 hover:text-blue-800 text-[20px]"
        >
          <FaEye className="inline" />
        </button>
        <button
          onClick={() => navigate(`/bookings/${booking.id}/edit`)}
          className="text-yellow-600 hover:text-yellow-800 text-[20px]"
        >
          <FaEdit className="inline" />
        </button>
        {booking.status !== 'CANCELLED' && (
          <button
            onClick={() => handleCancel(booking.id)}
            className="text-orange-600 hover:text-orange-800 text-[20px]"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => handleDelete(booking.id)}
          className="text-red-600 hover:text-red-800 text-[20px]"
        >
          <FaTrash className="inline" />
        </button>
      </td>
    </tr>
  )
}
