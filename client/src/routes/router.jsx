import { createBrowserRouter, Navigate, useLoaderData } from 'react-router-dom';
import api from '../lib/api';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import UserProfilePage from '../pages/UserProfilePage';
import UserLoanHistoryPage from '../pages/UserLoanHistoryPage';
import BorrowersPage from '../pages/BorrowersPage';
import LoansPage from '../pages/LoansPage';
import PaymentsPage from '../pages/PaymentsPage';
import HistoryPage from '../pages/HistoryPage';
import ApplicationDetailPage from '../pages/ApplicationDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const DATA_CACHE = new Map();
const DATA_TTL = 30000;

const fetchCached = async (url) => {
  const now = Date.now();
  const cached = DATA_CACHE.get(url);

  if (cached && now - cached.timestamp < DATA_TTL) {
    return cached.data;
  }

  const { data } = await api.get(url);
  const result = data?.success ? data.data : [];
  DATA_CACHE.set(url, { data: result, timestamp: now });
  return result;
};

const dashboardLoader = async () => {
  const [stats, loans, applications] = await Promise.all([
    fetchCached('/dashboard'),
    fetchCached('/loans'),
    fetchCached('/applications'),
  ]);

  return {
    stats: stats?.data || stats || null,
    loans: loans || [],
    applications: applications || [],
  };
};

const borrowersLoader = async () => {
  const [borrowers, loans] = await Promise.all([
    fetchCached('/borrowers'),
    fetchCached('/loans'),
  ]);

  return {
    borrowers: borrowers || [],
    loans: loans || [],
  };
};

const loansLoader = async () => {
  const [applications, eligibleBorrowers] = await Promise.all([
    fetchCached('/applications'),
    fetchCached('/borrowers/eligible'),
  ]);

  return {
    applications: applications || [],
    borrowers: eligibleBorrowers || [],
  };
};

const paymentsLoader = async () => {
  const [loans, payments] = await Promise.all([
    fetchCached('/loans'),
    fetchCached('/payments'),
  ]);

  return {
    loans: loans || [],
    payments: payments || [],
  };
};

const historyLoader = async () => {
  const loans = await fetchCached('/loans');
  return { loans: loans || [] };
};

const applicationLoader = async ({ params }) => {
  const application = await fetchCached(`/applications/${params.id}`);
  return { application: application || null };
};

// Component to route to correct dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  const data = useLoaderData();

  if (user?.role === 'admin') {
    return <AdminDashboardPage initialData={data} />;
  }
  return <UserDashboardPage initialData={data} />;
};

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { index: true, element: <Navigate to="login" replace /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardRouter />, loader: dashboardLoader, shouldRevalidate: () => false },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'history', element: <UserLoanHistoryPage />, loader: historyLoader, shouldRevalidate: () => false },
      { path: 'borrowers', element: <BorrowersPage />, loader: borrowersLoader, shouldRevalidate: () => false },
      { path: 'loans', element: <LoansPage />, loader: loansLoader, shouldRevalidate: () => false },
      { path: 'payments', element: <PaymentsPage />, loader: paymentsLoader, shouldRevalidate: () => false },
      { path: 'admin-history', element: <HistoryPage />, loader: historyLoader, shouldRevalidate: () => false },
      { path: 'applications/:id', element: <ApplicationDetailPage />, loader: applicationLoader, shouldRevalidate: () => false },
    ],
  },
]);

export default router;


