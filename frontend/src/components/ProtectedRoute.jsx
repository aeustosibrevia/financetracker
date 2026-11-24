import { Navigate, Outlet } from 'react-router-dom'
import { Container } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

const ProtectedRoute = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 3, mb: 5 }}>
        <Outlet />
      </Container>
    </>
  )
}

export default ProtectedRoute
