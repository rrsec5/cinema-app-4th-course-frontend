import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Movie, Session } from '../../interfaces/interfaces'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { toast } from 'sonner'
import { LoadingSpinner } from '../../components/UI/LoadingSpinner'
import { FaEdit, FaFilm, FaPlus, FaTrash } from 'react-icons/fa'
import { SessionCard } from '../../components/session/SessionCard'

// ============ Movie Detail Page ============
export const MovieDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie>()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const [movieRes, sessionsRes] = await Promise.all([
          api.get(`/api/movies/${id}`),
          api.get(`/api/movies/${id}/sessions`),
        ])
        setMovie(movieRes.data)
        setSessions(sessionsRes.data)
      } catch (err) {
        handleApiError(err, 'Failed to load movie details')
      } finally {
        setLoading(false)
      }
    }
    fetchMovieDetails()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return

    try {
      await api.delete(`/api/movies/${id}`)
      toast.success('Movie deleted successfully')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      handleApiError(err, 'Failed to delete movie')
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.delete(`/api/movies/sessions/${sessionId}`)
      toast.success('Session deleted successfully')
      // updating list
      setSessions(sessions.filter((s) => s.id !== sessionId))
    } catch (err) {
      handleApiError(err, 'Failed to delete session')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!movie) return <div className="text-center py-12">Movie not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <FaFilm className="text-white text-9xl opacity-30" />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {movie.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{movie.durationMinutes} minutes</span>
                <span>•</span>
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {movie.rating}/10
                </span>
                <span>•</span>
                <span>{movie.ageRestriction}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/movies/${id}/edit`)}
                className="flex items-center space-x-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{movie.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Additional Info</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Distributor:</span>{' '}
                {movie.distributor}
              </div>
              <div>
                <span className="font-medium">Release Date:</span>{' '}
                {movie.releaseDate}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Available Sessions</h2>
              <button
                onClick={() => navigate(`/sessions/create?movieId=${id}`)}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus />
                <span>Add Session</span>
              </button>
            </div>

            {sessions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No sessions available for this movie
              </p>
            ) : (
              <div className="grid gap-4">
                {sessions.map((session: Session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={handleDeleteSession}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
