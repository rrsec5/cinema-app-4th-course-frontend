import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { Booking, Movie, Seat, Session } from '../../interfaces/interfaces'
import { useEffect, useState } from 'react'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { toast } from 'sonner'

// ============ Create/Edit Booking Form ============
export const BookingFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [searchParams] = useState(new URLSearchParams(window.location.search))
  const [params] = useSearchParams()

  const sessionIdFromQuery = params.get('sessionId') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Booking>({
    mode: 'onChange',
    defaultValues: {
      userId: 'user-0001', // Due to the fact that registration is not implemented, the userid will be fixed
    },
  })

  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session>()
  const [existingBooking, setExistingBooking] = useState<Booking>()
  const [bookingSession, setBookingSession] = useState<Session>()
  const [sessionMovie, setsessionMovie] = useState<Movie>()
  const [loading, setLoading] = useState(false)
  const [seatsInput, setSeatsInput] = useState('')

  const currentSessionId = watch('sessionId')

  // If movieId is in URL — set it to form
  useEffect(() => {
    if (sessionIdFromQuery && sessions.length > 0) {
      setValue('sessionId', sessionIdFromQuery)
    }
  }, [sessionIdFromQuery, sessions, setValue])

  useEffect(() => {
    if (isEdit) {
      fetchBooking()
    } else {
      fetchSessions()
      const sessionId = searchParams.get('sessionId')
      if (sessionId) {
        fetchSessionDetails(sessionId)
        setValue('sessionId', sessionId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/api/bookings/${id}`)
      const booking = response.data
      setExistingBooking(booking)

      // загружаем реальный объект Session
      const sessionRes = await api.get(
        `/api/movies/sessions/${booking.sessionId}`,
      )
      setBookingSession(sessionRes.data)

      const movieRes = await api.get(`/api/movies/${sessionRes.data.movieId}`)
      setsessionMovie(movieRes.data)

      // Set form values for editable fields
      setValue('status', booking.status)
      setValue('notes', booking.notes || '')

      // Display seats in readable format
      const seatsDisplay =
        booking.seats
          ?.map((seat: Seat) => `Row ${seat.row}, Seat ${seat.number}`)
          .join(' | ') || 'No seats'
      setSeatsInput(seatsDisplay)
    } catch (err) {
      handleApiError(err, 'Failed to load booking')
      navigate('/bookings')
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await api.get('/api/movies/sessions')
      setSessions(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load sessions')
    }
  }

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await api.get(`/api/movies/sessions/${sessionId}`)
      setSelectedSession(response.data)
      setValue('sessionId', sessionId)
    } catch (err) {
      handleApiError(err, 'Failed to load movie')
    }
  }

  const handleSessionChange = (sessionId: string) => {
    fetchSessionDetails(sessionId)
  }

  const parseSeats = (seatsString: string) => {
    // Parse format: "1-5, 1-6, 2-10" into Seat[]
    return seatsString
      .split(',')
      .map((s) => {
        const [row, number] = s
          .trim()
          .split('-')
          .map((n) => parseInt(n))
        if (row && number) {
          return {
            row,
            number,
            seatId: `${row}-${number}`,
          }
        }
        return null
      })
      .filter((seat) => seat !== null)
  }

  const onSubmit = async (data: Booking) => {
    try {
      setLoading(true)

      if (isEdit) {
        // For editing, only send status and notes
        const updateData = {
          status: data.status,
          notes: data.notes || '',
        }

        await api.put(`/api/bookings/${id}`, updateData)
        toast.success('Booking updated successfully')
        navigate(`/bookings/${id}`)
      } else {
        // For creating, parse seats and send full booking data
        const seatsList = parseSeats(seatsInput)

        if (seatsList.length === 0) {
          toast.error('Please enter at least one seat')
          setLoading(false)
          return
        }

        const bookingData = {
          sessionId: data.sessionId,
          userId: data.userId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          seats: seatsList,
          notes: data.notes || '',
        }

        await api.post('/api/bookings', bookingData)
        toast.success('Booking created successfully')
        navigate('/bookings')
      }
    } catch (err) {
      handleApiError(err, `Failed to ${isEdit ? 'update' : 'create'} booking`)
    } finally {
      setLoading(false)
    }
  }

  const isSessionLocked = Boolean(sessionIdFromQuery)
  const sessionIdValue = watch('sessionId')
  const nameValue = watch('customerName')
  const emailValue = watch('customerEmail')
  const seatsValue = watch('seats')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Booking' : 'Create New Booking'}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          {/* ========== EDIT MODE: Show existing booking info ========== */}
          {isEdit && existingBooking && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900 mb-2">
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-blue-800">
                      Booking ID:
                    </span>
                    <p className="text-blue-700">{existingBooking.id}</p>
                  </div>
                  {existingBooking.userId && (
                    <div>
                      <span className="font-medium text-blue-800">
                        User ID:
                      </span>
                      <p className="text-blue-700">{existingBooking.userId}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-blue-800">Customer:</span>
                    <p className="text-blue-700">
                      {existingBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Email:</span>
                    <p className="text-blue-700">
                      {existingBooking.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {bookingSession && (
                    <div>
                      <span className="font-medium text-blue-800">
                        Session Info:
                      </span>
                      <div className="text-blue-700 text-sm space-y-1">
                        <p>Session Id: {bookingSession.id}</p>
                        <p>Movie: {sessionMovie?.title}</p>
                        <p>Hall: {bookingSession.hallId}</p>
                        <p>Available Seats: {bookingSession.availableSeats}</p>
                        <p>
                          Price: {bookingSession.price.value}{' '}
                          {bookingSession.price.currency}
                        </p>
                        <p>
                          Start:{' '}
                          {new Date(bookingSession.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-blue-800">
                      Total Price:
                    </span>
                    <p className="text-blue-700 font-semibold">
                      {existingBooking.totalPrice?.value}{' '}
                      {existingBooking.totalPrice?.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200 mt-3">
                <span className="font-medium text-blue-800">Seats:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {existingBooking.seats?.map((seat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      Row {seat.row}, Seat {seat.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========== CREATE MODE: Session Selection ========== */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Session{' '}
                  {!sessionIdValue && <span className="text-red-500">*</span>}
                </label>
                <select
                  {...register('sessionId', {
                    required: 'Session is required',
                  })}
                  disabled={isSessionLocked}
                  value={currentSessionId}
                  onChange={(e) => handleSessionChange(e.target.value)}
                  defaultValue={searchParams.get('sessionId') || ''}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isSessionLocked
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                >
                  <option value="" disabled hidden>
                    -- Select a session --
                  </option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      Movie: {session.movieId} |{' '}
                      {new Date(session.startTime).toLocaleString()} | Hall:{' '}
                      {session.hallId} | {session.price.value}{' '}
                      {session.price.currency}
                    </option>
                  ))}
                </select>
                {errors.sessionId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sessionId.message}
                  </p>
                )}
              </div>

              {selectedSession && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Session Details
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="text-green-700">
                      Available Seats: {selectedSession.availableSeats}
                    </p>
                    <p className="text-green-700">
                      Price: {selectedSession.price.value}{' '}
                      {selectedSession.price.currency}
                    </p>
                    <p className="text-green-700">
                      Start:{' '}
                      {new Date(selectedSession.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name{' '}
                  {!nameValue && <span className="text-red-500">*</span>}
                </label>
                <input
                  {...register('customerName', {
                    required: 'Customer name is required',
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email{' '}
                  {!emailValue && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  {...register('customerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats {!seatsValue && <span className="text-red-500">*</span>}
                  <span className="text-gray-500 text-xs ml-2">
                    (Format: row-seat, e.g., "1-5, 1-6, 2-10")
                  </span>
                </label>
                <input
                  value={seatsInput}
                  onChange={(e) => setSeatsInput(e.target.value)}
                  placeholder="1-5, 1-6, 2-10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter seats as row-number pairs separated by commas
                </p>
              </div>
            </>
          )}

          {/* ========== BOTH MODES: Status (editable in edit mode) ========== */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          )}

          {/* ========== BOTH MODES: Notes ========== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={isEdit ? 4 : 3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                isEdit ? 'Update notes...' : 'Any special requests...'
              }
            />
          </div>

          {/* ========== BOTH MODES: Seats Display (read-only in edit mode) ========== */}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/bookings/${id}` : '/bookings')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Booking'
                : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
