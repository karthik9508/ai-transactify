import Settings from '@/pages/Settings'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/AppLayout'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Settings />
      </AppLayout>
    </ProtectedRoute>
  )
}