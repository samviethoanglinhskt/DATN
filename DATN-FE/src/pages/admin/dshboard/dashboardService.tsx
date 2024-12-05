import axios from "axios";
import moment from "moment";
import {
  APIResponse,
  DailyStats,
  OrderStatsResponse,
  RevenueResponse,
  TopSellingResponse,
} from "./type";

const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchDashboardData = async (type: string = "day") => {
  try {
    const [monthlyStats, revenueStats, topSellingStats, orderStats] =
      await Promise.all([
        axios.get<APIResponse>(`${BASE_URL}/statistics/monthly`),
        axios.get<RevenueResponse>(
          `${BASE_URL}/statistics/revenue?type=${type}`
        ),
        axios.get<TopSellingResponse>(
          `${BASE_URL}/statistics/top-selling-products`
        ),
        axios.get<OrderStatsResponse>(`${BASE_URL}/statistics/order`),
      ]);

    const monthlyData = monthlyStats.data;
    const revenueData = revenueStats.data;
    const topSellingData = topSellingStats.data;
    const orderStatsData = orderStats.data;
    console.log(orderStatsData)

    const latestUserStats =
      monthlyData["Người dùng"][monthlyData["Người dùng"].length - 1];
    const latestOrderStats =
      monthlyData["Tổng đơn hàng"][monthlyData["Tổng đơn hàng"].length - 1];

    const statistics = {
      totalUsers: monthlyData["Tổng tất cả người dùng"],
      totalOrders: monthlyData["Tổng tất cả đơn hàng"],
      completedOrders: monthlyData["Tổng tất cả đơn hàng thành công"],
      cancelledOrders: monthlyData["Tổng tất cả đơn hàng hủy"],
      pendingOrders: orderStatsData["Tổng tất cả đơn hàng chờ xử lý"],
      failedDeliveryOrders:
        orderStatsData["Tổng tất cả đơn hàng giao hàng thất bại"],
      completionRate: parseFloat(
        monthlyData["Tổng tỉ lệ hoàn thành đơn hàng"].replace(" %", "")
      ),
      cancellationRate: parseFloat(
        monthlyData["Tổng tỉ lệ hủy đơn hàng"].replace(" %", "")
      ),
      userGrowth: latestUserStats.growth_percentage,
      orderGrowth: latestOrderStats.growth_percentageOrder,
      totalRevenue: monthlyData["Tổng doanh thu"],
      revenueGrowth: parseFloat(latestOrderStats.growthPercentageRevenue),
    };

    let dailyStats: DailyStats[] = [];

    if (type === "day" && revenueData.Ngày?.Doanh_thu) {
      dailyStats = revenueData.Ngày.Doanh_thu.map((item) => ({
        date: moment(item.date).format("DD/MM/YYYY"),
        revenue: parseInt(item.revenue),
        revenueGrowth:
          item.growth_percentage === "Không có dữ liệu ngày trước"
            ? 0
            : parseFloat(item.growth_percentage),
        orders: 0,
        users: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
      }));
    } else if (type === "month" && Array.isArray(revenueData.Tháng)) {
      dailyStats = revenueData.Tháng.map((item) => ({
        date: `Tháng ${item.month}/${item.year}`,
        revenue: parseInt(item.revenue),
        revenueGrowth:
          item.growth_percentage === "Không có dữ liệu tháng trước"
            ? 0
            : parseFloat(item.growth_percentage),
        orders: 0,
        users: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
      }));
    } else if (type === "year" && Array.isArray(revenueData.Năm)) {
      dailyStats = revenueData.Năm.map((item) => ({
        date: `Năm ${item.year}`,
        revenue: parseInt(item.revenue),
        revenueGrowth:
          item.growth_percentage === "Không có dữ liệu năm trước"
            ? 0
            : parseFloat(item.growth_percentage),
        orders: 0,
        users: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
      }));
    }

    dailyStats.sort((a, b) => {
      if (type === "day") {
        return (
          moment(b.date, "DD/MM/YYYY").valueOf() -
          moment(a.date, "DD/MM/YYYY").valueOf()
        );
      }
      return b.date.localeCompare(a.date);
    });

    const monthKeys = Object.keys(topSellingData.data).sort().reverse();
    const latestMonth = monthKeys[0];
    const topProducts = topSellingData.data[latestMonth].map((product) => ({
      id: product.id,
      name: product.name,
      sales: parseInt(product.total_quantity),
      revenue: parseInt(product.total_revenue),
      growth: parseFloat(product.growth_rate.replace(" %", "")),
      month: product.month,
      year: product.year,
    }));

    return {
      statistics,
      dailyStats,
      topProducts,
      orderStats: orderStatsData,
      // Thêm dữ liệu cho modal
      "Người dùng": monthlyData["Người dùng"],
      "Tổng đơn hàng": monthlyData["Tổng đơn hàng"],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
