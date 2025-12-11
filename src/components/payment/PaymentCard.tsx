import { useNavigate } from 'react-router-dom'
import type { Payment } from '../../interfaces/interfaces'

type PaymentCardProps = {
  payment: Payment
  handleRefund: (value: string) => void
}

// ============ Movie Card Component ============
export const PaymentCard = ({ payment, handleRefund }: PaymentCardProps) => {
  const navigate = useNavigate()
  return (
    <tr key={payment.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">{payment.id}</td>
      <td
        className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer"
        onClick={() => navigate(`/bookings/${payment.bookingId}`)}
      >
        {payment.bookingId}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        {payment.amount?.value} {payment.amount?.currency}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{payment.method}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            payment.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : payment.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : payment.status === 'REFUNDED'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {payment.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {new Date(payment.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-sm space-x-2">
        {payment.status === 'COMPLETED' && (
          <button
            onClick={() => handleRefund(payment.id)}
            className="text-purple-600 hover:text-purple-800"
          >
            Refund
          </button>
        )}
      </td>
    </tr>
  )
}
