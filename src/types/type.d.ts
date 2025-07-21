import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Dashboard Types
export interface DashboardData {
  lowStockCount: number;
  todaySales: number;
  deliveredOrders: number;
  conversionRate: number;
  completionRate: number;
  cancelledOrders: number;
  salesChart: { month: string; revenue: number; orders: number }[];
  topProducts: {
    _id: string;
    name: string;
    category: string;
    image: string;
    totalSold: number;
    revenue: number;
  }[];
  orderStats: { status: string; count: number; percent: number; color: string }[];
}

export interface SalesChartData {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  category: string;
  image: string;
  totalSold: number;
  revenue: number;
}

export interface OrderStat {
  status: string;
  count: number;
  percent: number;
  color: string;
}
