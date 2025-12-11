import { useNavigate } from 'react-router-dom'
import { FaFilm } from 'react-icons/fa'
import type { Movie } from '../../interfaces/interfaces'

type MovieCardProps = {
  movie: Movie
}

// ============ Movie Card Component ============
export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/movies/${movie.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="h-48 bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center">
        <FaFilm className="text-white text-6xl opacity-50 group-hover:scale-110 transition" />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {movie.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres?.map((genre, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{movie.durationMinutes} min</span>
          <span className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            {movie.rating}/10
          </span>
        </div>
      </div>
    </div>
  )
}
