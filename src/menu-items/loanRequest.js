// assets
import { IconRouteSquare, IconPlus } from '@tabler/icons-react';

// constant
const icons = { IconRouteSquare, IconPlus };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const loanRequests = {
  id: 'loanRequests',
  title: 'Loan Requests',
  type: 'group',
  children: [
    {
      id: 'viewLoanRequests',
      title: 'View Loan Requests',
      type: 'item',
      url: '/loan-requests',
      icon: icons.IconRouteSquare,
      breadcrumbs: false
    },
    
    {
      id: 'createLoanRequest',
      title: 'Create Loan Request',
      type: 'item',
      url: '/loan-request/create',
      icon: icons.IconPlus,
      breadcrumbs: false
    },
  ]
};

export default loanRequests;
