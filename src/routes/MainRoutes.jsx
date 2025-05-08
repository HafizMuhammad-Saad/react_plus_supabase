import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

import ProtectedRoute from './ProtectedRoutes';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardAdmin = Loadable(lazy(() => import('views/dashboard/Admin')));
 
// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const ContactPage = Loadable(lazy(() => import('views/contact-page')));
const LoanRequests = Loadable(lazy(() => import('views/loan-requests')));
const LoanDetail = Loadable(lazy(() => import('views/loan-detail')));
const LoanRequest = Loadable(lazy(() => import('views/loan-request')));
const Profile = Loadable(lazy(() => import('views/profile')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute element={<DashboardDefault />} />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'admin',
          element: <ProtectedRoute element={<DashboardAdmin />} />
        },
        {
          path: 'default',
          element: <ProtectedRoute element={<DashboardDefault />} />
        }
      ]
    },
    {
      path: '/sample-page',
      element: <ProtectedRoute element={<SamplePage />} />
    },
    {
      path: '/contact-us',
      element: <ProtectedRoute element={<ContactPage />} />
    },
    {
      path: '/profile',
      element: <ProtectedRoute element={<Profile />} />
    },
    {
      path: '/loan-requests',
      element: <ProtectedRoute element={<LoanRequests />} />,
      
    },
    {
      path: '/loan-request/create',
      element: <ProtectedRoute element={<LoanRequest />} />,
    },
    {
      path: '/loan-requests/:id',
      element: <ProtectedRoute element={<LoanDetail />} />
    }
  ]
};

export default MainRoutes;
