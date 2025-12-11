import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { Movie, Session } from '../../interfaces/interfaces'
import { handleApiError } from '../../api/handleApiError'
import { api } from '../../api/apiConfig'
import { toast } from 'sonner'

// ============ Create Session Form ============
export const SessionFormPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const movieIdFromQuery = params.get('movieId') ?? ''

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Session>()

  const [movies, setMovies] = useState<Movie[]>([])
  const [existingSession, setExistingSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)

  const currentMovieId = watch('movieId')

  // If movieId is in URL — set it to form
  useEffect(() => {
    if (movieIdFromQuery && movies.length > 0) {
      setValue('movieId', movieIdFromQuery)
    }
  }, [movieIdFromQuery, movies, setValue])

  useEffect(() => {
    if (!isEdit) fetchMovies()
  }, [isEdit])

  useEffect(() => {
    if (isEdit) {
      fetchMovies()
      fetchSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchMovies = async () => {
    try {
      const response = await api.get('/api/movies')
      setMovies(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load movies')
    }
  }

  const fetchSession = async () => {
    try {
      const res = await api.get(`/api/movies/sessions/${id}`)
      const session = res.data
      setExistingSession(session)

      // Set fields (editable)
      setValue('startTime', session.startTime.slice(0, 16))
      setValue('endTime', session.endTime.slice(0, 16))
      setValue('availableSeats', session.availableSeats)
      setValue('status', session.status)

      // Set disabled fields as initial values
      setValue('movieId', session.movieId)
      setValue('hallId', session.hallId)
      setValue('price.value', session.price.value)
      setValue('price.currency', session.price.currency)
    } catch (err) {
      handleApiError(err, 'Failed to load session')
      navigate('/movies')
    }
  }

  const onSubmit = async (data: Session) => {
    try {
      setLoading(true)

      if (isEdit) {
        // update request DTO
        const updateData = {
          startTime: data.startTime,
          endTime: data.endTime,
          availableSeats: data.availableSeats,
          status: data.status,
        }

        await api.put(`/api/movies/sessions/${id}`, updateData)
        toast.success('Session updated successfully')
        navigate(`/movies/${existingSession?.movieId}`)
      } else {
        const sessionData = {
          movieId: data.movieId,
          hallId: data.hallId,
          startTime: data.startTime,
          endTime: data.endTime,
          price: {
            value: data.price.value,
            currency: data.price.currency,
          },
          availableSeats: data.availableSeats,
          status: data.status,
        }

        await api.post('/api/movies/sessions', sessionData)
        navigate(`/movies/${data.movieId}`)
      }
    } catch (err) {
      handleApiError(err, `Failed to ${isEdit ? 'update' : 'create'} session`)
    } finally {
      setLoading(false)
    }
  }

  const isMovieLocked = Boolean(movieIdFromQuery)
  const hallIdValue = watch('hallId')
  const movieIdValue = watch('movieId')
  const startTimeValue = watch('startTime')
  const endTimeValue = watch('endTime')
  const priceValue = watch('price.value')
  const currencyValue = watch('price.currency')
  const availableSeatsValue = watch('availableSeats')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Session' : 'Create New Session'}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Movie{' '}
              {!movieIdValue && <span className="text-red-500">*</span>}
            </label>
            <select
              {...register('movieId', {
                required: !isEdit && 'Movie is required',
              })}
              disabled={isMovieLocked || isEdit}
              value={isEdit ? existingSession?.movieId : currentMovieId}
              onChange={(e) => setValue('movieId', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${
                isMovieLocked || isEdit
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              }`}
            >
              {/* Default option only if dropdown is open */}
              {!isMovieLocked && !isEdit && (
                <option value="" disabled hidden>
                  -- Select a movie --
                </option>
              )}
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.durationMinutes} min)
                </option>
              ))}
            </select>
            {errors.movieId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.movieId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hall ID {!hallIdValue && <span className="text-red-500">*</span>}
            </label>
            <input
              {...register('hallId', { required: 'Hall ID is required' })}
              disabled={isEdit}
              placeholder="HALL-1"
              className={`w-full px-4 py-2 border rounded-lg ${
                isEdit
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-transparent'
              }`}
            />
            {errors.hallId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hallId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time{' '}
                {!startTimeValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="datetime-local"
                {...register('startTime', {
                  required: 'Start time is required',
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time{' '}
                {!endTimeValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="datetime-local"
                {...register('endTime', { required: 'End time is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price {!priceValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price.value', {
                  required: !isEdit && 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
                disabled={isEdit}
                placeholder="150.00"
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEdit
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-transparent'
                }`}
              />
              {errors.price?.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.value.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency{' '}
                {!currencyValue && <span className="text-red-500">*</span>}
              </label>
              <select
                {...register('price.currency', {
                  required: !isEdit && 'Currency is required',
                })}
                disabled={isEdit}
                defaultValue={isEdit ? existingSession?.price.currency : 'UAH'}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEdit
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-transparent'
                }`}
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              {errors.price?.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.currency.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Seats{' '}
              {!availableSeatsValue && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              {...register('availableSeats', {
                required: 'Available seats is required',
                min: { value: 1, message: 'Must have at least 1 seat' },
              })}
              placeholder="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.availableSeats && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availableSeats.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              defaultValue="Scheduled"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
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
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Session'
                : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
