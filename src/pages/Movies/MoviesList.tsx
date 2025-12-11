import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Movie } from '../../interfaces/interfaces'
import { api } from '../../api/apiConfig'
import { handleApiError } from '../../api/handleApiError'
import { FaFilm, FaPlus } from 'react-icons/fa'
import { LoadingSpinner } from '../../components/UI/LoadingSpinner'
import { MovieCard } from '../../components/movie/MovieCard'

// ============ Movies List Page ============
export const MoviesListPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async (search = '') => {
    try {
      setLoading(true)
      const url = search
        ? `/api/movies?search=${encodeURIComponent(search)}`
        : '/api/movies'
      const response = await api.get(url)
      setMovies(response.data)
    } catch (err) {
      handleApiError(err, 'Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    fetchMovies(searchQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Movies Catalog</h1>
        <button
          onClick={() => navigate('/movies/create')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Add Movie</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <FaFilm className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
