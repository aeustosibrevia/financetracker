import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          Budget Tracker
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Transactions
        </Button>
        <Button color="inherit" component={RouterLink} to="/categories">
          Categories
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography sx={{ mr: 2 }}>{user.name}</Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
