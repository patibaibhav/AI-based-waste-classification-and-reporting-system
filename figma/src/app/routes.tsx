import { createBrowserRouter } from 'react-router';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './screens/Home';
import { WasteClassification } from './screens/WasteClassification';
import { Result } from './screens/Result';
import { ComplaintReporting } from './screens/ComplaintReporting';
import { ComplaintHistory } from './screens/ComplaintHistory';
import { Profile } from './screens/Profile';
import { LocalityInsights } from './screens/LocalityInsights';
import { AdminDashboard } from './screens/AdminDashboard';
import { ComplaintManagement } from './screens/ComplaintManagement';
import { Login } from './screens/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'classify', element: <WasteClassification /> },
      { path: 'result', element: <Result /> },
      { path: 'report', element: <ComplaintReporting /> },
      { path: 'history', element: <ComplaintHistory /> },
      { path: 'profile', element: <Profile /> },
      { path: 'locality', element: <LocalityInsights /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'complaints', element: <ComplaintManagement /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);
