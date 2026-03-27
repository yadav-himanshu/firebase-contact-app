import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import SharedContacts from './pages/SharedContacts';
import { useAuth } from './hooks/useAuth';

function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared/:userId"
          element={
            <ProtectedRoute>
              <SharedContacts />
            </ProtectedRoute>
          }
        />
        {/* Fallback to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
