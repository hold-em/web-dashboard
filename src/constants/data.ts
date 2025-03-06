import { NavItem } from 'types';
import { Icons } from '@/components/icons';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Function to create a navigation item with standard properties
export const createNavItem = (
  title: string,
  url: string,
  icon: keyof typeof Icons,
  shortcut: [string, string],
  items: NavItem[] = []
): NavItem => ({
  title,
  url,
  icon,
  isActive: false,
  shortcut,
  items
});

// Base navigation items that are available to all users
const baseNavItems: NavItem[] = [
  createNavItem('대시보드', '/dashboard/overview', 'house', ['1', '1'], []),
  createNavItem('매장 관리', '/dashboard/store-management', 'building', [
    '2',
    '2'
  ]),
  createNavItem('게임 관리', '/dashboard/game-management', 'gamepad', [
    '3',
    '3'
  ]),
  createNavItem(
    '테이블 관리',
    '/dashboard/table-management',
    'layoutDashboard',
    ['4', '4'],
    []
  ),
  createNavItem('고객 관리', '/dashboard/customer-management', 'users', [
    '5',
    '5'
  ]),
  createNavItem(
    '이용권 관리',
    '/dashboard/ticket-management',
    'ticket',
    ['6', '6'],
    []
  ),
  createNavItem(
    '결제 관리',
    '/dashboard/payment-management',
    'creditCard',
    ['7', '7'],
    []
  )
];

// Admin-only navigation items
const adminNavItems: NavItem[] = [
  createNavItem(
    '리그 관리',
    '/dashboard/league-management',
    'settings',
    ['8', '8'],
    []
  )
];

// Function to get navigation items based on user role
export const getNavItems = (role?: string): NavItem[] => {
  // If the user is a system admin, include admin-specific items
  if (role === 'SYSTEM_ADMIN') {
    return [...baseNavItems, ...adminNavItems];
  }

  // Otherwise, return only the base items
  return baseNavItems;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [...baseNavItems, ...adminNavItems];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
