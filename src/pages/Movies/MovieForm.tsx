import { useNavigate, useParams } from 'react-router-dom'
import {
  AGE_RATINGS,
  MOVIE_GENRES,
  type MovieForm,
  type MovieGenre,
} from '../../interfaces/interfaces'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { toast } from 'sonner'

// ============ Create/Edit Movie Form ============
export const MovieFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<MovieForm>({
    mode: 'onChange',
    defaultValues: {
      releaseDate: today,
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchMovie = async (id: string) => {
        try {
          const { data } = await api.get(`/api/movies/${id}`)

          reset({
            ...data,
            durationMinutes: data.durationMinutes.toString(),
            rating: data.rating.toString(),
            genres: data.genres as MovieGenre[],
          })
        } catch (err) {
          handleApiError(err, 'Failed to load movie')
        }
      }
      fetchMovie(id)
    }
  }, [id, reset])

  const onSubmit = async (data: MovieForm) => {
    try {
      setLoading(true)

      const movieData = {
        ...data,
        durationMinutes: Number(data.durationMinutes),
        rating: Number(data.rating),
        genres: data.genres, // на сервер отправляем массив выбранных жанров
      }

      if (isEdit) {
        await api.put(`/api/movies/${id}`, movieData)
        toast.success('Movie updated successfully')
      } else {
        await api.post('/api/movies', movieData)
        toast.success('Movie created successfully')
      }

      navigate('/')
    } catch (err) {
      handleApiError(err, `Failed to ${isEdit ? 'update' : 'create'} movie`)
    } finally {
      setLoading(false)
    }
  }

  const titleValue = watch('title')
  const decriptionValue = watch('description')
  const durationValue = watch('durationMinutes')
  const ratingValue = watch('rating')
  const genresValue = watch('genres')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Movie' : 'Add New Movie'}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title {!titleValue && <span className="text-red-500">*</span>}
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Film Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description{' '}
              {!decriptionValue && <span className="text-red-500">*</span>}
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Film Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes){' '}
                {!durationValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                step={1}
                {...register('durationMinutes', {
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be positive' },
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: 'Only positive integers',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.durationMinutes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-10){' '}
                {!ratingValue && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                step="0.1"
                {...register('rating', {
                  required: 'Rating is required',
                  min: { value: 0, message: 'Rating must be between 0 and 10' },
                  max: {
                    value: 10,
                    message: 'Rating must be between 0 and 10',
                  },
                  validate: {
                    maxTwoDecimals: (value) => {
                      const str = String(value)
                      const cleaned = str.replace(',', '.')
                      const [, decimals] = cleaned.split('.')
                      return (
                        !decimals ||
                        decimals.length <= 1 ||
                        'Max 1 decimal place'
                      )
                    },
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rating.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres {!genresValue && <span className="text-red-500">*</span>}{' '}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOVIE_GENRES.map((g) => (
                <label key={g} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={g}
                    {...register('genres', { required: 'Genres is required' })}
                  />
                  {g}
                </label>
              ))}
            </div>
            {errors.genres && (
              <p className="text-red-500 text-sm mt-1">
                Select at least one genre
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Restriction
              </label>
              <select
                {...register('ageRestriction')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {AGE_RATINGS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date
              </label>
              <input
                {...register('releaseDate', {
                  required: false,
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: 'Use ISO YYYY-MM-DD',
                  },
                })}
                placeholder="2024-12-01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-sm mt-1">
                  Wrong date format, try yyyy-mm-dd
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distributor
            </label>
            <input
              {...register('distributor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              disabled={!isValid}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
