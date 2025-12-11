import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { Booking, Payment } from '../../interfaces/interfaces'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'

// ============ Create Payment Form ============
export const CreatePaymentPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useState(new URLSearchParams(window.location.search))
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Payment>()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
    const bookingId = searchParams.get('bookingId')
    if (bookingId) {
      fetchBookingDetails(bookingId)
    }
  }, [searchParams])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings?status=CONFIRMED')
      setBookings(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load bookings')
    }
  }

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}`)
      setSelectedBooking(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load bookings')
    }
  }

  const onSubmit = async (data: Payment) => {
    try {
      setLoading(true)

      const paymentData = {
        bookingId: data.bookingId,
        amount: {
          value: data.amount.value,
          currency: data.amount.currency,
        },
        method: data.method,
      }
      console.log(paymentData)
      await api.post('/api/payments', paymentData)
      navigate('/payments')
    } catch (err) {
      handleApiError(err, 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingChange = (bookingId: string) => {
    fetchBookingDetails(bookingId)
  }

  useEffect(() => {
    if (selectedBooking?.totalPrice) {
      setValue('amount.value', selectedBooking.totalPrice.value)
      setValue('amount.currency', selectedBooking.totalPrice.currency)
    }
  }, [selectedBooking, setValue])

  const amountValue = watch('amount.value')
  const amountCurr = watch('amount.currency')
  const methodValue = watch('method')
  const bookingIdValue = watch('bookingId')

  console.log(selectedBooking?.totalPrice?.currency)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Process Payment</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Booking{' '}
              {!bookingIdValue && <span className="text-red-500">*</span>}
            </label>
            <select
              {...register('bookingId', { required: 'Booking is required' })}
              onChange={(e) => handleBookingChange(e.target.value)}
              defaultValue={searchParams.get('bookingId') || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>
                -- Select a booking --
              </option>
              {bookings.map((booking) => (
                <option key={booking.id} value={booking.id}>
                  {booking.customerName} - Session: {booking.sessionId} -{' '}
                  {booking.totalPrice?.value} {booking.totalPrice?.currency}
                </option>
              ))}
            </select>
            {errors.bookingId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bookingId.message}
              </p>
            )}
          </div>

          {selectedBooking && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Details</h3>
              <p className="text-sm text-gray-700">
                Customer: {selectedBooking.customerName}
              </p>
              <p className="text-sm text-gray-700">
                Email: {selectedBooking.customerEmail}
              </p>
              <p className="text-sm text-gray-700">
                Total: {selectedBooking.totalPrice?.value}{' '}
                {selectedBooking.totalPrice?.currency}
              </p>
              <p className="text-sm text-gray-700">
                Seats: {selectedBooking.seats?.length}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount {!amountValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amount.value', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be positive' },
                })}
                readOnly
                value={selectedBooking?.totalPrice?.value || ''}
                className=" bg-gray-100 cursor-not-allowed w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="100.00"
              />
              {errors.amount?.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency{' '}
                {!amountCurr && <span className="text-red-500">*</span>}
              </label>
              <select
                {...register('amount.currency', {
                  required: 'Currency is required',
                })}
                pointer-events-none
                value={selectedBooking?.totalPrice?.currency || ''}
                className="w-full px-4 py-2 bg-gray-100 cursor-not-allowed border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              {errors.amount?.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.currency.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method{' '}
              {!methodValue && <span className="text-red-500">*</span>}
            </label>
            <select
              {...register('method', {
                required: 'Payment method is required',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>
                -- Select method --
              </option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="PAYPAL">Paypal</option>
            </select>
            {errors.method && (
              <p className="text-red-500 text-sm mt-1">
                {errors.method.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
