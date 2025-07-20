import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import Loader from "@/components/Loader"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}