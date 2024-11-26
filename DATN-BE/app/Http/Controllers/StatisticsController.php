<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    // Doanh thu
    public function revenueByDay(Request $request)
    {
        $type = $request->input('type', 'all');
        if ($type == 'all') {
            // doanh thu theo ngày
            $dailyRevenue = DB::table('tb_oders')
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date', 'asc')
                ->get();
            // Tính tỷ lệ tăng trưởng cho mỗi ngày
            $dailyRevenueWithGrowth = [];
            foreach ($dailyRevenue as $index => $data) {
                // Thêm doanh thu cho ngày hiện tại
                $currentRevenue = $data->revenue;

                // Kiểm tra nếu không phải là ngày đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu ngày hôm trước
                    $previousRevenue = $dailyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousRevenue > 0) {
                        $growthPercentage = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là ngày đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu ngày trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $dailyRevenueWithGrowth[] = $data;
            }

            // ------------------------------------------------------------------------------------------------------------------------------

            // doanh thu tháng
            $monthlyRevenue = DB::table('tb_oders')
                ->select(DB::raw('MONTH(created_at) as month'), DB::raw('YEAR(created_at) as year'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->get();


            // Tính tỷ lệ tăng trưởng cho mỗi tháng
            $monthlyRevenueWithGrowth = [];
            foreach ($monthlyRevenue as $index => $data) {
                // Thêm doanh thu cho tháng hiện tại
                $currentRevenue = $data->revenue;

                // Kiểm tra nếu không phải là tháng đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu tháng trước
                    $previousRevenue = $monthlyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousRevenue > 0) {
                        $growthPercentage = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là tháng đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu tháng trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $monthlyRevenueWithGrowth[] = $data;
            }

            // ------------------------------------------------------------------------------------------------------------------------------

            // doanh thu năm
            $yearlyRevenue = DB::table('tb_oders')
                ->select(DB::raw('YEAR(created_at) as year'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('YEAR(created_at)'))
                ->orderBy('year', 'asc')
                ->get();


            // Tính tỷ lệ tăng trưởng cho mỗi năm
            $yearlyRevenueWithGrowth = [];
            foreach ($yearlyRevenue as $index => $data) {
                // Thêm doanh thu cho năm hiện tại
                $currentYearRevenue = $data->revenue;

                // Kiểm tra nếu không phải là năm đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu năm trước
                    $previousYearRevenue = $yearlyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousYearRevenue > 0) {
                        $growthPercentage = (($currentYearRevenue - $previousYearRevenue) / $previousYearRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là năm đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu năm trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $yearlyRevenueWithGrowth[] = $data;
            }
            return response()->json([
                'message' => 'Doanh thu theo ngày tháng năm cùng tỉ lệ tăng trưởng',
                'Ngày' => [
                    'Doanh_thu' => $dailyRevenue
                ],
                'Tháng' => [
                    'Doanh_thu' => $monthlyRevenue
                ],
                'Năm' => [
                    'Doanh_thu' => $yearlyRevenue
                ]
            ], 200);
        }
        if ($type == 'day') {
            // doanh thu theo ngày
            $dailyRevenue = DB::table('tb_oders')
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date', 'asc')
                ->get();
            // Tính tỷ lệ tăng trưởng cho mỗi ngày
            $dailyRevenueWithGrowth = [];
            foreach ($dailyRevenue as $index => $data) {
                // Thêm doanh thu cho ngày hiện tại
                $currentRevenue = $data->revenue;

                // Kiểm tra nếu không phải là ngày đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu ngày hôm trước
                    $previousRevenue = $dailyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousRevenue > 0) {
                        $growthPercentage = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là ngày đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu ngày trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $dailyRevenueWithGrowth[] = $data;
            }

            return response()->json([
                'message' => 'Doanh thu theo ngày',
                'Ngày' => [
                    'Doanh_thu' => $dailyRevenue,
                ]
            ], 200);
        }

        if ($type == 'month') {
            // doanh thu tháng
            $monthlyRevenue = DB::table('tb_oders')
                ->select(DB::raw('MONTH(created_at) as month'), DB::raw('YEAR(created_at) as year'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->get();


            // Tính tỷ lệ tăng trưởng cho mỗi tháng
            $monthlyRevenueWithGrowth = [];
            foreach ($monthlyRevenue as $index => $data) {
                // Thêm doanh thu cho tháng hiện tại
                $currentRevenue = $data->revenue;

                // Kiểm tra nếu không phải là tháng đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu tháng trước
                    $previousRevenue = $monthlyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousRevenue > 0) {
                        $growthPercentage = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là tháng đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu tháng trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $monthlyRevenueWithGrowth[] = $data;
            }
            return response()->json([
                'message' => 'Doanh thu theo tháng',
                'Tháng' => $monthlyRevenue
            ], 200);
        }
        if ($type == 'year') {
            // doanh thu năm
            $yearlyRevenue = DB::table('tb_oders')
                ->select(DB::raw('YEAR(created_at) as year'), DB::raw('SUM(total_amount) as revenue'))
                ->where('order_status', 'Đã Hoàn Thành') // Lọc theo trạng thái
                ->groupBy(DB::raw('YEAR(created_at)'))
                ->orderBy('year', 'asc')
                ->get();


            // Tính tỷ lệ tăng trưởng cho mỗi năm
            $yearlyRevenueWithGrowth = [];
            foreach ($yearlyRevenue as $index => $data) {
                // Thêm doanh thu cho năm hiện tại
                $currentYearRevenue = $data->revenue;

                // Kiểm tra nếu không phải là năm đầu tiên để tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    // Doanh thu năm trước
                    $previousYearRevenue = $yearlyRevenue[$index - 1]->revenue;

                    // Tính tỷ lệ tăng trưởng phần trăm
                    $growthPercentage = 0;
                    if ($previousYearRevenue > 0) {
                        $growthPercentage = (($currentYearRevenue - $previousYearRevenue) / $previousYearRevenue) * 100;
                    }

                    // Thêm tỷ lệ tăng trưởng vào kết quả
                    $data->growth_percentage = round($growthPercentage, 2) . ' %';
                } else {
                    // Nếu là năm đầu tiên, không tính tăng trưởng
                    $data->growth_percentage = 'Không có dữ liệu năm trước';
                }

                // Thêm dữ liệu vào mảng kết quả
                $yearlyRevenueWithGrowth[] = $data;
            }
            return response()->json([
                'message' => 'Doanh thu theo năm',
                'Năm' => $yearlyRevenue
            ], 200);
        }
        return response()->json(['message' => 'Loại thời gian không hợp lệ.'], 400);
    }
    // top sản phẩm bán chạy
    public function topSellingProductsByMonth()
    {
        // Lấy danh sách sản phẩm bán chạy theo từng tháng
        $productsByMonth = DB::table('tb__oderdetail') // Tên bảng chi tiết đơn hàng
            ->join('tb_products', 'tb__oderdetail.tb_product_id', '=', 'tb_products.id') // Kết nối với bảng sản phẩm
            ->join('tb_oders', 'tb__oderdetail.tb_oder_id', '=', 'tb_oders.id') // Kết nối với bảng đơn hàng
            ->select(
                DB::raw('YEAR(tb_oders.created_at) as year'),
                DB::raw('MONTH(tb_oders.created_at) as month'),
                'tb_products.id',
                'tb_products.name',
                DB::raw('SUM(tb__oderdetail.quantity) as total_quantity'),
                DB::raw('SUM(tb__oderdetail.quantity * tb__oderdetail.price) as total_revenue')
            )
            ->where('tb_oders.order_status', 'Đã Hoàn Thành') // Lọc trạng thái đơn hàng hoàn thành
            ->groupBy('year', 'month', 'tb_products.id', 'tb_products.name') // Nhóm theo năm, tháng và sản phẩm
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->orderBy('total_quantity', 'desc') // Sắp xếp theo số lượng bán giảm dần
            ->limit(10)
            ->get();

        // Chuyển dữ liệu thành mảng đa chiều theo từng tháng
        $groupedData = $productsByMonth->groupBy(function ($item) {
            return $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT); // Nhóm theo "YYYY-MM"
        });

        // Tính tỷ lệ tăng trưởng
        $result = [];
        $previousMonthData = []; // Dữ liệu của tháng trước để tính tăng trưởng

        foreach ($groupedData as $month => $products) {
            $currentMonthData = $products->pluck('total_quantity', 'id')->toArray(); // Dữ liệu số lượng bán theo ID sản phẩm

            // Tính tăng trưởng cho từng sản phẩm
            $productsWithGrowth = $products->map(function ($product) use ($previousMonthData) {
                $lastMonthQuantity = $previousMonthData[$product->id] ?? 0; // Lấy dữ liệu tháng trước (nếu không có thì là 0)
                if ($lastMonthQuantity > 0) {
                    $growthRate = (($product->total_quantity - $lastMonthQuantity) / $lastMonthQuantity) * 100;
                } else {
                    $growthRate = $product->total_quantity > 0 ? 100 : 0; // Nếu tháng trước không có dữ liệu
                }

                // Gắn thêm tỷ lệ tăng trưởng vào dữ liệu
                $product->growth_rate = round($growthRate, 2) . ' %'; // Làm tròn 2 chữ số thập phân
                return $product;
            });

            // Lưu kết quả vào mảng
            $result[$month] = $productsWithGrowth;

            // Cập nhật dữ liệu tháng hiện tại để dùng cho lần lặp tiếp theo
            $previousMonthData = $currentMonthData;
        }

        return response()->json([
            'message' => 'Danh sách sản phẩm bán chạy theo tháng',
            'data' => $result
        ]);
    }

    // thống kê tỉ lệ hoàn thành, hủy
    public function monthlyStatistics()
    {

        // tổng tài khoản
        $listuser = DB::table('users')
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as total_users')
            )
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        $totalUser = [];
        $grandTotalUsers = 0;
        foreach ($listuser as $index => $data) {
            // Thêm doanh thu cho ngày hiện tại
            $currentUser = $data->total_users;
            $grandTotalUsers += $currentUser;

            // Kiểm tra nếu không phải là ngày đầu tiên để tính tỷ lệ tăng trưởng
            if ($index > 0) {
                // Doanh thu ngày hôm trước
                $previousUser = $listuser[$index - 1]->total_users;

                // Tính tỷ lệ tăng trưởng phần trăm
                $growthPercentage = 0;
                if ($previousUser > 0) {
                    $growthPercentage = (($currentUser - $previousUser) / $previousUser) * 100;
                }

                // Thêm tỷ lệ tăng trưởng vào kết quả
                $data->growth_percentage = round($growthPercentage, 2) . ' %';
            } else {
                // Nếu là ngày đầu tiên, không tính tăng trưởng
                $data->growth_percentage = 'Không có dữ liệu tháng trước';
            }
            // Thêm dữ liệu vào mảng kết quả
            $totalUser[] = $data;
        }

        //----------------------------------------------------------------------------------------------------------------
        // Thống kê đơn hàng theo tháng
        $orderStatistics = DB::table('tb_oders')
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Đã Hoàn Thành" THEN 1 ELSE 0 END) as completed_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Đã hủy đơn hàng" THEN 1 ELSE 0 END) as cancelled_orders')
            )
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        $totalOrder = [];
        $grandTotalOrder = 0;
        $grandTotalComplete = 0;
        $grandTotalCancel = 0;
        foreach ($orderStatistics as $index => $order) {
            // Thêm doanh thu cho ngày hiện tại
            $currentOrder = $order->total_orders;
            $grandTotalOrder += $currentOrder;

            $currentComplete = $order->completed_orders;
            $currentCancel = $order->cancelled_orders;
            $grandTotalComplete += $currentComplete;
            $grandTotalCancel += $currentCancel;
            // Kiểm tra nếu không phải là ngày đầu tiên để tính tỷ lệ tăng trưởng
            if ($index > 0) {
                // Doanh thu ngày hôm trước
                $previousOrder = $orderStatistics[$index - 1]->total_orders;
                $previousComplete = $orderStatistics[$index - 1]->completed_orders;
                $previousCancel = $orderStatistics[$index - 1]->cancelled_orders;

                // Tính tỷ lệ tăng trưởng phần trăm
                $growthPercentageOrder = 0;
                if ($previousOrder > 0) {
                    $growthPercentageOrder = (($currentOrder - $previousOrder) / $previousOrder) * 100;
                }
                if ($previousComplete > 0) {
                    $growthPercentageComplete = (($currentComplete - $previousComplete) / $previousComplete) * 100;
                }
                if ($previousCancel > 0) {
                    $growthPercentageCancel = (($currentCancel - $previousCancel) / $previousCancel) * 100;
                }


                // Thêm tỷ lệ tăng trưởng vào kết quả
                $order->growth_percentageOrder = round($growthPercentageOrder, 2) . ' %';
                $order->growthPercentageComplete = round($growthPercentageComplete, 2) . ' %';
                $order->growthPercentageCancel = round($growthPercentageCancel, 2) . ' %';
            } else {
                // Nếu là ngày đầu tiên, không tính tăng trưởng
                $order->growth_percentageOrder = 'Không có dữ liệu tháng trước';
                $order->growthPercentageComplete = 'Không có dữ liệu tháng trước';
                $order->growthPercentageCancel = 'Không có dữ liệu tháng trước';
            }

            // Thêm dữ liệu vào mảng kết quả
            $totalOrder[] = $order;
        }
        // Tính tỷ lệ phần trăm hoàn thành và hủy
        $completionRate = $grandTotalOrder > 0
            ? round(($grandTotalComplete / $grandTotalOrder) * 100, 2) . ' %'
            : 'Không có dữ liệu';
        $cancellationRate = $grandTotalOrder > 0
            ? round(($grandTotalCancel / $grandTotalOrder) * 100, 2) . ' %'
            : 'Không có dữ liệu';
        return response()->json([
            'message' => 'Thống kê theo tháng',
            'Người dùng' => $totalUser,
            'Tổng tất cả người dùng' => $grandTotalUsers,
            'Tổng đơn hàng' => $totalOrder,
            'Tổng tất cả đơn hàng' => $grandTotalOrder,
            'Tổng tất cả đơn hàng thành công' => $grandTotalComplete,
            'Tổng tất cả đơn hàng hủy' => $grandTotalCancel,
            'Tổng tỉ lệ hoàn thành đơn hàng' => $completionRate,
            'Tổng tỉ lệ hủy đơn hàng' => $cancellationRate
        ], 200);
    }
}
