// types.ts
export interface UserStatistic {
  month: number;
  year: number;
  total_users: number;
  growth_percentage: string;
}

export interface OrderStatistic {
  month: number;
  year: number;
  total_orders: number;
  completed_orders: string;
  cancelled_orders: string;
  total_revenue: string;
  growth_percentageOrder: string;
  growthPercentageComplete: string;
  growthPercentageCancel: string;
  growthPercentageRevenue: string;
}

export interface APIResponse {
  message: string;
  "Người dùng": UserStatistic[];
  "Tổng tất cả người dùng": number;
  "Tổng đơn hàng": OrderStatistic[];
  "Tổng tất cả đơn hàng": number;
  "Tổng tất cả đơn hàng thành công": number;
  "Tổng tất cả đơn hàng hủy": number;
  "Tổng tất cả đơn hàng chờ xử lý": number;
  "Tổng tất cả đơn hàng giao hàng thất bại": number;
  "Tổng tỉ lệ hoàn thành đơn hàng": string;
  "Tổng tỉ lệ hủy đơn hàng": string;
  "Tổng tỉ lệ chờ xử lý": string; // Added key
  "Tổng tỉ lệ thất bại": string; // Added key
  "Tổng doanh thu": number;
}

export interface StatisticData {
  totalUsers: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number; // Added
  failedDeliveryOrders: number; // Added
  completionRate: number;
  cancellationRate: number;
  userGrowth: string;
  orderGrowth: string;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  month: number;
  year: number;
}
export interface RevenueByPeriod {
  date?: string;
  month?: number;
  year: number;
  revenue: string;
  growth_percentage: string;
}

export interface RevenueResponse {
  message: string;
  Ngày: {
    Doanh_thu: RevenueByPeriod[];
  };
  Tháng: {
    Doanh_thu: RevenueByPeriod[];
  };
  Năm: {
    Doanh_thu: RevenueByPeriod[];
  };
}

// Cập nhật DailyStats để có revenue
export interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}
export interface RevenueByPeriod {
  date?: string;
  month?: number;
  year: number;
  revenue: string;
  growth_percentage: string;
}

export interface RevenueResponse {
  message: string;
  Ngày: {
    Doanh_thu: RevenueByPeriod[];
  };
  Tháng: {
    Doanh_thu: RevenueByPeriod[];
  };
  Năm: {
    Doanh_thu: RevenueByPeriod[];
  };
}

export interface DailyStats {
  date: string;
  revenue: number;
  revenueGrowth: number;
}
export interface TopSellingProduct {
  year: number;
  month: number;
  id: number;
  name: string;
  total_quantity: string;
  total_revenue: string;
  growth_rate: string;
}

export interface TopSellingResponse {
  message: string;
  data: {
    [key: string]: TopSellingProduct[];
  };
}
export interface RevenueStats {
  date: string;
  revenue: number;
  revenueGrowth: number;
}

export interface StatisticData {
  totalUsers: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
  cancellationRate: number;
  userGrowth: string;
  orderGrowth: string;
  totalRevenue: number;
  revenueGrowth: number;
}
export interface MonthlyData {
  "Người dùng": UserStatistic[];
  "Tổng đơn hàng": OrderStatistic[];
}
export interface OrderStatsResponse {
  message: string;
  pending_orders: string;
  failed_delivery_orders: string;
  "Tổng tất cả đơn hàng chờ xử lý": number;
  "Tổng tất cả đơn hàng giao hàng thất bại": number;
}
export interface DashboardData {
  statistics: StatisticData;
  dailyStats: DailyStats[];
  topProducts: TopProduct[];
  orderStats?: OrderStatsResponse; // Added
  "Người dùng": UserStatistic[];
  "Tổng đơn hàng": OrderStatistic[];
}
