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

// Base navigation items that are available to all users
export const baseNavItems: NavItem[] = [
  {
    title: '대시보드',
    url: '/dashboard/overview',
    icon: 'house',
    isActive: false,
    shortcut: ['1', '1'],
    items: []
  },
  {
    title: '매장 관리',
    url: '/dashboard/store-management',
    icon: 'building',
    isActive: false,
    shortcut: ['2', '2'],
    items: []
  },
  {
    title: '게임 관리',
    url: '/dashboard/game-management',
    icon: 'gamepad',
    isActive: false,
    shortcut: ['3', '3'],
    items: []
  },
  {
    title: '테이블 관리',
    url: '/dashboard/table-management',
    icon: 'layoutDashboard',
    isActive: false,
    shortcut: ['4', '4'],
    items: []
  },
  {
    title: '고객 관리',
    url: '/dashboard/customer-management',
    icon: 'users',
    isActive: false,
    shortcut: ['5', '5'],
    items: []
  },
  {
    title: '이용권 관리',
    url: '/dashboard/ticket-management',
    icon: 'ticket',
    isActive: false,
    shortcut: ['6', '6'],
    items: []
  },
  {
    title: '결제 관리',
    url: '/dashboard/payment-management',
    icon: 'creditCard',
    isActive: false,
    shortcut: ['7', '7'],
    items: []
  }
];

// Admin-only navigation items
const adminNavItems: NavItem[] = [
  {
    title: '게임 타입 관리',
    url: '/dashboard/game-type-management',
    icon: 'settings',
    isActive: false,
    shortcut: ['g', 't'],
    items: []
  },
  {
    title: '리그 관리',
    url: '/dashboard/league-management',
    icon: 'settings',
    isActive: false,
    shortcut: ['l', 'm'],
    items: []
  },
  {
    title: '관리자 관리',
    url: '/dashboard/admin-management',
    icon: 'settings',
    isActive: false,
    shortcut: ['a', 'm'],
    items: []
  }
];

// Function to get navigation items based on user role
export const getNavItems = (role?: string): NavItem[] => {
  if (!role) return [];
  // If the user is a system admin, include admin-specific items
  if (role === 'SYSTEM_ADMIN') {
    return [...adminNavItems];
  }

  // Otherwise, return only the base items
  return baseNavItems;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [...baseNavItems, ...adminNavItems];
