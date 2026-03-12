export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'user';
  image?: string;
  subscription: {
    isActive: boolean;
    plan: 'month' | 'year';
  };
  firstLoginDone: boolean;
}

export interface Bed {
  _id: string;
  id: number;
  status: 'occupied' | 'available' | 'cleaning';
  assignedUser?: {
    name: string;
    email: string;
  } | null;
}

export interface Ward {
  _id: string;
  name: string;
  beds: Bed[];
}

export interface Department {
  _id: string;
  name: string;
  wards: Ward[];
}

export interface Assignment {
  _id: string;
  userId: string;
  deptId: string;
  wardName: string;
  beds: string[];
  deptExpiry: string;
  wardExpiry: string;
  status?: 'active' | 'expired';
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  userId?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDepartments: number;
  totalBeds: number;
  totalAssignments: number;
  activeSubscriptions: number;
}

export interface SupportTicket {
  _id: string;
  userId: string;
  userName?: string;
  subject: string;
  message: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  responses?: Array<{
    message: string;
    createdAt: string;
    isAdmin: boolean;
  }>;
}

export type BedStatus = 'occupied' | 'available' | 'cleaning';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  plan: string;
}
