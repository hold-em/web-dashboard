import { NavItem } from 'types';

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

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: '대시보드',
    url: '/dashboard/overview',
    icon: 'house',
    isActive: false,
    shortcut: ['cmd', '1'],
    items: []
  },
  {
    title: '매장 관리',
    url: '/dashboard/store-management',
    icon: 'building',
    isActive: false,
    shortcut: ['cmd', '2']
  },
  {
    title: '게임',
    url: '/dashboard/game',
    icon: 'gamepad',
    isActive: false,
    shortcut: ['cmd', '3'],
    items: [
      {
        title: '게임 관리',
        url: '/dashboard/game-management'
      },
      {
        title: '스트럭처 관리',
        url: '/dashboard/structure-management'
      },
      {
        title: '게임 생성',
        url: '/dashboard/create-game'
      }
    ]
  },
  {
    title: '테이블 관리',
    url: '/dashboard/table-management',
    icon: 'layoutDashboard',
    isActive: false,
    shortcut: ['cmd', '4'],
    items: []
  },
  {
    title: '고객 관리',
    url: '/dashboard/customer-management',
    icon: 'users',
    isActive: false,
    shortcut: ['cmd', '5']
  },
  {
    title: '이용권 관리',
    url: '/dashboard/ticket-management',
    icon: 'ticket',
    isActive: false,
    shortcut: ['cmd', '6'],
    items: []
  },
  {
    title: '결제 관리',
    url: '/dashboard/payment-management',
    icon: 'creditCard',
    isActive: false,
    shortcut: ['cmd', '7'],
    items: []
  }
];

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
