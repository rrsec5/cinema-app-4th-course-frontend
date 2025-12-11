import { useEffect, useState } from 'react'
import type { Payment } from '../../interfaces/interfaces'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { toast } from 'sonner'
import { FaCreditCard, FaPlus } from 'react-icons/fa'
import { LoadingSpinner } from '../../components/UI/LoadingSpinner'
import { PaymentCard } from '../../components/payment/PaymentCard'

// ============ Payments List Page ============
export const PaymentsListPage = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/payments')
      setPayments(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (id: string) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) return

    try {
      await api.post(`/api/payments/${id}/refund`, {
        reason: 'Customer request',
      })
      toast.success('Payment refunded successfully')
      fetchPayments()
    } catch (err) {
      handleApiError(err, 'Failed to refund payment')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <button
          onClick={() => navigate('/payments/create')}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FaPlus />
          <span>New Payment</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment: Payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  handleRefund={handleRefund}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
