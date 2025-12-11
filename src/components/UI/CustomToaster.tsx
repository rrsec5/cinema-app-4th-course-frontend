// components/CustomToaster.tsx
import { Toaster } from 'sonner'

export const CustomToaster = () => (
  <Toaster
    position="bottom-right"
    richColors
    expand={true}
    toastOptions={{
      classNames: {
        toast: '!bg-white !border !border-gray-200 !shadow-lg',
        success: '!text-green-600 !border-green-200',
        error: '!text-red-600 !border-red-200',
        loading: '!text-blue-600',
        info: '!text-blue-600',
      },
    }}
  />
)
