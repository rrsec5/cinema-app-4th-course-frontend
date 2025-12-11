export type ApiError = {
  status: number
  error: string
  message: string
  path: string
  timestamp: Date
}

export type Price = {
  value: number
  currency: string
}

export type Session = {
  id: string
  movieId: string
  hallId: string
  startTime: string // LocalDateTime -> string
  endTime: string // LocalDateTime -> string
  price: Price
  availableSeats: number
  status: string
}

export type Seat = {
  row: number
  number: number
  seatId: string
}

export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western',
] as const

export type MovieGenre = (typeof MOVIE_GENRES)[number]

export const AGE_RATINGS = ['0+', '8+', '12+', '16+', '18+', '21+'] as const

export type AgeRestriction = (typeof AGE_RATINGS)[number]

export type Movie = {
  id?: string
  title: string
  description: string
  durationMinutes: number
  genres: string[]
  rating?: number
  ageRestriction: string
  distributor: string
  releaseDate: string // ISO "2024-05-12"
}

export type MovieForm = {
  id?: string
  title: string
  description: string
  durationMinutes: number
  genres: MovieGenre[]
  rating?: number
  ageRestriction: AgeRestriction
  distributor: string
  releaseDate: string // ISO "2024-05-12"
}

export type Booking = {
  id: string
  sessionId: string
  userId?: string //поставить по дефолту user-0001
  customerName: string
  customerEmail: string
  seats: Seat[]
  totalPrice: Price
  status: string
  createdAt: string
  expiresAt: string | null
  confirmedAt: string | null
  notes: string | null
}

export type Payment = {
  id: string
  bookingId: string
  amount: Price
  method: string
  status: string
  transactionId: string
  createdAt: string
  processedAt: string | null
}
