import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Artworks from '../pages/Artworks/Artworks';
import NewArtwork from '../pages/Artworks/NewArtwork';
import ArtworkDetails from '../pages/Artworks/ArtworkDetails';
import Artists from '../pages/Artists/Artists';
import Buyers from '../pages/Buyers/Buyers';
import Depositors from '../pages/Depositors/Depositors';
import Categories from '../pages/Categories/Categories';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';

function ProtectedRoute() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'artworks', element: <Artworks /> },
          { path: 'artworks/new', element: <NewArtwork /> },
          { path: 'artworks/:id', element: <ArtworkDetails /> },
          { path: 'artists', element: <Artists /> },
          { path: 'buyers', element: <Buyers /> },
          { path: 'depositors', element: <Depositors /> },
          { path: 'categories', element: <Categories /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);