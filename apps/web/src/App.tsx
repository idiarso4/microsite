import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import ComprehensiveLandingPage from './components/ComprehensiveLandingPage'
import LoginPage from './components/auth/LoginPage'
import AccountingLandingPage from './modules/accounting/AccountingLandingPage'
import AccountingLoginPage from './modules/accounting/AccountingLoginPage'
import InventoryLandingPage from './modules/inventory/InventoryLandingPage'
import HRLandingPage from './modules/hr/HRLandingPage'
import CRMLandingPage from './modules/crm/CRMLandingPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardOverview from './components/dashboard/DashboardOverview'
import CRMPage from './components/dashboard/CRMPage'
import InventoryPage from './components/dashboard/InventoryPage'
import OrdersPage from './components/dashboard/OrdersPage'
import FinancePage from './components/dashboard/FinancePage'
import ProcurementPage from './components/dashboard/ProcurementPage'
import HRPage from './components/dashboard/HRPage'
import AnalyticsPage from './components/dashboard/AnalyticsPage'
import ReportsPage from './components/dashboard/ReportsPage'
import SettingsPage from './components/dashboard/SettingsPage'
import ProfilePage from './components/dashboard/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#DC143C', // Crimson Red
    },
    secondary: {
      main: '#1A1A1A', // Deep Black
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    error: {
      main: '#FF4444',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ComprehensiveLandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Module Landing Pages */}
          <Route path="/accounting" element={<AccountingLandingPage />} />
          <Route path="/inventory" element={<InventoryLandingPage />} />
          <Route path="/hr" element={<HRLandingPage />} />
          <Route path="/crm" element={<CRMLandingPage />} />

          {/* Module Login Pages */}
          <Route path="/accounting/login" element={<AccountingLoginPage />} />
          <Route path="/inventory/login" element={<LoginPage />} />
          <Route path="/hr/login" element={<LoginPage />} />
          <Route path="/crm/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardOverview />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CRMPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <DashboardLayout>
                <InventoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrdersPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute>
              <DashboardLayout>
                <FinancePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/procurement" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProcurementPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/hr" element={
            <ProtectedRoute>
              <DashboardLayout>
                <HRPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

