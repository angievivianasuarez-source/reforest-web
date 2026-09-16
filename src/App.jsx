import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Incendios from './pages/Incendios';
import Donaciones from './pages/Donaciones';
import Voluntarios from './pages/Voluntarios';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incendios"
        element={
          <ProtectedRoute>
            <Navbar />
            <Incendios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donaciones"
        element={
          <ProtectedRoute>
            <Navbar />
            <Donaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voluntarios"
        element={
          <ProtectedRoute>
            <Navbar />
            <Voluntarios />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
