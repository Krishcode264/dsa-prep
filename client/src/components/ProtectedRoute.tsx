import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state: { currentUser, initializing } } = useUserStore();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[color:var(--primary)] h-full">
        <div className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-[color:var(--text-main)]">Establishing Privacy...</div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to auth with current path as redirect param
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${returnUrl}`} replace />;
  }

  return <>{children}</>;
}
