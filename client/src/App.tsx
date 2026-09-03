import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { state: { initializing }, dispatch } = useUserStore();

  useEffect(() => {
    const savedUser = localStorage.getItem('dsa_user');
    const isGuest = localStorage.getItem('dsa_is_guest') === 'true';

    if (savedUser) {
      try {
        dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
      } catch (e) {
        localStorage.removeItem('dsa_user');
      }
    } else if (isGuest) {
      dispatch({ type: 'SET_GUEST' });
    }
    dispatch({ type: 'SET_INITIALIZED' });
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-[color:var(--primary)] text-[color:var(--text-main)]">
        <div className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Establishing Connection...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="font-sans h-screen flex flex-col overflow-hidden bg-[color:var(--primary)] selection:bg-[color:var(--border-main)] selection:text-[color:var(--surface)]">
        <NavBar />
        
        <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:companyName" element={<CompanyDetailPage />} />
            
            {/* Protected Routes */}
            <Route path="/questions" element={
              <ProtectedRoute>
                <QuestionsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
