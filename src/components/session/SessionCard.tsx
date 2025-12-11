import { useNavigate } from 'react-router-dom'
import type { Session } from '../../interfaces/interfaces'
import { FaEdit, FaTrash } from 'react-icons/fa'

type SessionCardProps = {
  session: Session
  onDelete?: (id: string) => void
}

// ============ Session Card Component ============
export const SessionCard = ({ session, onDelete }: SessionCardProps) => {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) return
    if (onDelete) onDelete(session.id)
  }

  return (
    <div
      key={session.id}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition"
    >
      <div className="flex justify-between items-center">
        <div>
          {session.id} {session.status}
          <p className="font-semibold text-lg">
            {new Date(session.startTime).toLocaleString()}
          </p>
          <p className="text-gray-600">
            Hall: {session.hallId} • Available Seats: {session.availableSeats}
          </p>
          <p className="text-green-600 font-semibold">
            {session.price.value} {session.price.currency}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {session.status == 'Scheduled' && (
            <button
              onClick={() =>
                navigate(`/bookings/create?sessionId=${session.id}`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          )}

          <button
            onClick={() => navigate(`/sessions/${session.id}/edit`)}
            className="flex items-center space-x-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <FaEdit /> <span>Edit</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaTrash /> <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
