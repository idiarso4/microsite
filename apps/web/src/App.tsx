import { useQuery } from '@tanstack/react-query'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, Box, Typography, Button, TextField, Paper } from '@mui/material'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

async function fetchHealth() {
  const res = await fetch('http://localhost:3000/health')
  if (!res.ok) throw new Error('Failed to fetch health')
  return res.json()
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Login clicked for ${email}`)
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
        </Box>
      </Paper>
    </Container>
  )
}

function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['health'], queryFn: fetchHealth })

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {isLoading && <Typography>Loading health...</Typography>}
      {error && <Typography color="error">{String(error)}</Typography>}
      {data && (
        <Paper sx={{ p: 2 }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Paper>
      )}
    </Container>
  )
}

const theme = createTheme({ palette: { mode: 'light' } })

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Login />
        <Dashboard />
      </Box>
    </ThemeProvider>
  )
}

