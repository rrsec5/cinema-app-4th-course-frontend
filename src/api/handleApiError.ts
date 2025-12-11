import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

// ============ Error Handler ====== ======
export const handleApiError = (
  error: unknown,
  customMessage = 'An error occurred',
) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    //мб тут нужно из интерфейсов ерор взять
    if (axiosError.response) {
      const status = axiosError.response.status
      const data = axiosError.response.data as { message?: string }

      if (status >= 500) {
        toast.error('Service Unavailable', {
          description:
            data?.message ||
            'The service is temporarily unavailable. Please try again later.',
        })
        return
      }

      if (status >= 400) {
        toast.error('Error', {
          description: data?.message || customMessage,
        })
        return
      }
    }

    if (axiosError.request) {
      toast.error('Network Error', {
        description:
          'Unable to connect to the server. Please check your connection.',
      })
      return
    }

    // fallback for axios errors without response/request
    toast.error('Error', {
      description: axiosError.message || customMessage,
    })
    return
  }

  // Если это стандартная Error
  if (error instanceof Error) {
    toast.error('Error', { description: error.message || customMessage })
    return
  }

  // Любой другой случай (string, null, undefined, и т.д.)
  toast.error('Error', { description: String(error) || customMessage })
}
