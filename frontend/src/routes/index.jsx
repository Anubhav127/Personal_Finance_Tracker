import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import { Route } from 'react-router-dom';

// Lazy load page components for code splitting
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Route configuration
const router = createBrowserRouter([
   {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      
        <DashboardPage />
    ),
  },
]
);

export default router;
