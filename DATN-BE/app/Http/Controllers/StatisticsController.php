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
                    $data->growth_percentage = '0 %';
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
                    $data->growth_percentage = '0 %';
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
                    $data->growth_percentage = '0 %';
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
                    $data->growth_percentage = '0 %';
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
                    $data->growth_percentage = '0 %';
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
                    $data->growth_percentage = '0 %';
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

    // top thương hiệu bán chạy
    public function brandStatistics(Request $request)
    {
        $type = $request->input('type', 'month'); // Mặc định là thống kê theo tháng

        // Xử lý query dựa trên loại thống kê
        $query = DB::table('tb__oderdetail')
            ->join('tb_products', 'tb__oderdetail.tb_product_id', '=', 'tb_products.id')
            ->join('tb_brands', 'tb_products.tb_brand_id', '=', 'tb_brands.id')
            ->select(
                DB::raw('COUNT(tb__oderdetail.id) as total_sales'),
                DB::raw('SUM(tb__oderdetail.quantity) as total_quantity'),
                DB::raw('tb_brands.name as brand_name'),
                DB::raw('YEAR(tb__oderdetail.created_at) as year')
            );

        // Thống kê theo kiểu theo tuần, tháng, quý, năm
        if ($type == 'week') {
            // Thống kê theo tuần trong năm
            $query->addSelect(DB::raw('MONTH(tb__oderdetail.created_at) as month'), DB::raw('FLOOR((DAY(tb__oderdetail.created_at) - 1) / 7) + 1 as week_in_month'))
                ->groupBy('year', 'month', 'week_in_month', 'tb_brands.name')
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->orderBy('week_in_month', 'asc');
        } elseif ($type == 'quarter') {
            // Thống kê theo quý
            $query->addSelect(DB::raw('QUARTER(tb__oderdetail.created_at) as quarter'), DB::raw('MONTH(tb__oderdetail.created_at) as month'))
                ->groupBy('year', DB::raw('QUARTER(tb__oderdetail.created_at)'), 'month', 'tb_brands.name')
                ->orderBy('year', 'asc')
                ->orderBy('quarter', 'asc')
                ->orderBy('month', 'asc');
        } elseif ($type == 'year') {
            // Thống kê theo quý
            $query->groupBy('year', 'tb_brands.name')
                ->orderBy('year', 'asc');
        } else {
            // Mặc định là thống kê theo tháng
            $query->addSelect(DB::raw('MONTH(tb__oderdetail.created_at) as month'))
                ->groupBy(DB::raw('YEAR(tb__oderdetail.created_at)'), DB::raw('MONTH(tb__oderdetail.created_at)'), 'tb_brands.name')
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc');
        }

        // Lấy kết quả thống kê
        $brandStatistics = $query->get();

        $totalSales = [];
        $grandTotalSales = 0;
        $grandTotalQuantity = 0;

        // Nhóm kết quả theo thời gian (năm-tháng, năm-quý, năm-tuần)
        $brandStatsByTime = [];
        foreach ($brandStatistics as $brand) {
            if ($type == 'week') {
                $timeKey = $brand->year . '-W' . str_pad($brand->week_in_month, 2, '0', STR_PAD_LEFT);
            } elseif ($type == 'quarter') {
                $timeKey = $brand->year . '-Q' . $brand->quarter;
            } elseif ($type == 'year') {
                $timeKey = $brand->year;
            } else {
                // Thống kê theo tháng
                $timeKey = $brand->year . '-' . str_pad($brand->month, 2, '0', STR_PAD_LEFT);
            }

            if (!isset($brandStatsByTime[$timeKey])) {
                $brandStatsByTime[$timeKey] = [];
            }

            $brandStatsByTime[$timeKey][] = $brand;
        }

        // Lọc top 3 thương hiệu bán chạy trong mỗi thời gian
        foreach ($brandStatsByTime as  $brands) {
            usort($brands, function ($a, $b) {
                return $b->total_sales - $a->total_sales; // Sắp xếp theo doanh số
            });

            // Lấy 3 thương hiệu đầu tiên trong khoảng thời gian này
            $top3Brands = array_slice($brands, 0, 3);

            foreach ($top3Brands as $index => $brand) {
                $currentSales = $brand->total_sales;
                $currentQuantity = $brand->total_quantity;

                $grandTotalSales += $currentSales;
                $grandTotalQuantity += $currentQuantity;

                // Tính tỷ lệ tăng trưởng
                if ($index > 0) {
                    $previousSales = $top3Brands[$index - 1]->total_sales;
                    $previousQuantity = $top3Brands[$index - 1]->total_quantity;

                    $growthPercentageSales = $previousSales != 0 ? (($currentSales - $previousSales) / $previousSales) * 100 : 0;
                    $growthPercentageQuantity = $previousQuantity != 0 ? (($currentQuantity - $previousQuantity) / $previousQuantity) * 100 : 0;

                    $brand->growthPercentageSales = round($growthPercentageSales, 2) . ' %';
                    $brand->growthPercentageQuantity = round($growthPercentageQuantity, 2) . ' %';
                } else {
                    $brand->growthPercentageSales = '0 %';
                    $brand->growthPercentageQuantity = '0 %';
                }

                $totalSales[] = $brand;
            }
        }

        return response()->json([
            'message' => 'Thống kê thương hiệu bán chạy',
            'Top thương hiệu bán chạy' => $totalSales,
            'Tổng sản phẩm của tất cả thương hiệu bán chạy' => $grandTotalSales,
            'Tổng số lượng bán ra' => $grandTotalQuantity,
        ], 200);
    }

    // top sản phẩm bán chạy
    public function topSellingProducts(Request $request)
    {
        $type = $request->input('type', 'month'); // Mặc định là 'month'

        // Khởi tạo query chung
        $query = DB::table('tb__oderdetail')
            ->join('tb_products', 'tb__oderdetail.tb_product_id', '=', 'tb_products.id')
            ->join('tb_oders', 'tb__oderdetail.tb_oder_id', '=', 'tb_oders.id')
            ->select(
                DB::raw('YEAR(tb_oders.created_at) as year'),
                'tb_products.id',
                'tb_products.name',
                DB::raw('SUM(tb__oderdetail.quantity) as total_quantity'),
                DB::raw('SUM(tb__oderdetail.quantity * tb__oderdetail.price) as total_revenue')
            )
            ->where('tb_oders.order_status', 'Đã Hoàn Thành');

        // Điều kiện thống kê theo loại
        switch ($type) {
            case 'week':
                $query->addSelect(DB::raw(DB::raw('FLOOR((DAY(tb_oders.created_at) - 1) / 7) + 1 as week_in_month')), DB::raw('MONTH(tb_oders.created_at) as month'))
                    ->groupBy('year', 'month', 'week_in_month', 'tb_products.id', 'tb_products.name')
                    ->orderBy('year', 'asc')
                    ->orderBy('month', 'asc')
                    ->orderBy('week_in_month', 'asc');
                break;

            case 'quarter':
                $query->addSelect(DB::raw('QUARTER(tb_oders.created_at) as quarter'))
                    ->groupBy('year', 'quarter', 'tb_products.id', 'tb_products.name')
                    ->orderBy('year', 'asc')
                    ->orderBy('quarter', 'asc');
                break;

            case 'year':
                $query->groupBy('year', 'tb_products.id', 'tb_products.name')
                    ->orderBy('year', 'asc');
                break;

            default: // Mặc định là theo tháng
                $query->addSelect(DB::raw('MONTH(tb_oders.created_at) as month'))
                    ->groupBy('year', 'month', 'tb_products.id', 'tb_products.name')
                    ->orderBy('year', 'asc')
                    ->orderBy('month', 'asc');
        }

        $products = $query->orderBy('total_quantity', 'desc')->limit(10)->get();

        // Xử lý dữ liệu theo từng nhóm (tuần/tháng/quý/năm)
        $groupedData = $products->groupBy(function ($item) use ($type) {
            switch ($type) {
                case 'week':
                    return $item->year . '-' . $item->month . '-W' . str_pad($item->week_in_month, 2, '0', STR_PAD_LEFT);
                case 'quarter':
                    return $item->year . '-Q' . $item->quarter;
                case 'year':
                    return $item->year;
                default: // Tháng
                    return $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
            }
        });

        // Tính tỷ lệ tăng trưởng
        $result = [];
        $previousData = []; // Dữ liệu của nhóm trước để tính tăng trưởng

        foreach ($groupedData as $group => $products) {
            $currentData = $products->pluck('total_quantity', 'id')->toArray();

            // Tính tăng trưởng cho từng sản phẩm
            $productsWithGrowth = $products->map(function ($product) use ($previousData) {
                $lastQuantity = $previousData[$product->id] ?? 0;
                $growthRate = $lastQuantity > 0
                    ? (($product->total_quantity - $lastQuantity) / $lastQuantity) * 100
                    : ($product->total_quantity > 0 ? 100 : 0);

                $product->growth_rate = round($growthRate, 2) . ' %';
                return $product;
            });

            // Lưu kết quả vào mảng
            $result[$group] = $productsWithGrowth;

            // Cập nhật dữ liệu hiện tại để dùng cho lần lặp tiếp theo
            $previousData = $currentData;
        }

        return response()->json([
            'message' => 'Danh sách sản phẩm bán chạy',
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
                $data->growth_percentage = '0 %';
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
                DB::raw('SUM(CASE WHEN order_status = "Đã hủy đơn hàng" THEN 1 ELSE 0 END) as cancelled_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Đã Hoàn Thành" THEN total_amount ELSE 0 END) as total_revenue')
            )
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        $totalOrder = [];
        $grandTotalOrder = 0;
        $grandTotalComplete = 0;
        $grandTotalCancel = 0;
        $grandTotalRevenue = 0;
        foreach ($orderStatistics as $index => $order) {
            // Thêm doanh thu cho ngày hiện tại
            $currentOrder = $order->total_orders;
            $currentComplete = $order->completed_orders;
            $currentCancel = $order->cancelled_orders;
            $currentRevenue = $order->total_revenue;


            $grandTotalOrder += $currentOrder;
            $grandTotalComplete += $currentComplete;
            $grandTotalCancel += $currentCancel;
            $grandTotalRevenue += $currentRevenue;
            // Kiểm tra nếu không phải là ngày đầu tiên để tính tỷ lệ tăng trưởng
            if ($index > 0) {
                // Doanh thu ngày hôm trước
                $previousOrder = $orderStatistics[$index - 1]->total_orders;
                $previousComplete = $orderStatistics[$index - 1]->completed_orders;
                $previousCancel = $orderStatistics[$index - 1]->cancelled_orders;
                $previousRevenue = $orderStatistics[$index - 1]->total_revenue;

                // Tính tỷ lệ tăng trưởng phần trăm
                $growthPercentageOrder = 0;
                $growthPercentageComplete = 0;
                $growthPercentageCancel = 0;
                $growthPercentageRevenue = 0;
                if ($previousOrder > 0) {
                    $growthPercentageOrder = (($currentOrder - $previousOrder) / $previousOrder) * 100;
                }
                if ($previousComplete > 0) {
                    $growthPercentageComplete = (($currentComplete - $previousComplete) / $previousComplete) * 100;
                }
                if ($previousCancel > 0) {
                    $growthPercentageCancel = (($currentCancel - $previousCancel) / $previousCancel) * 100;
                }
                if ($previousRevenue > 0) {
                    $growthPercentageRevenue  = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
                }


                // Thêm tỷ lệ tăng trưởng vào kết quả
                $order->growth_percentageOrder = round($growthPercentageOrder, 2) . ' %';
                $order->growthPercentageComplete = round($growthPercentageComplete, 2) . ' %';
                $order->growthPercentageCancel = round($growthPercentageCancel, 2) . ' %';
                $order->growthPercentageRevenue  = round($growthPercentageRevenue, 2) . ' %';
            } else {
                // Nếu là ngày đầu tiên, không tính tăng trưởng
                $order->growth_percentageOrder = '0 %';
                $order->growthPercentageComplete = '0 %';
                $order->growthPercentageCancel = '0 %';
                $order->growthPercentageRevenue = '0 %';
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
            'Tổng tỉ lệ hủy đơn hàng' => $cancellationRate,
            'Tổng doanh thu' => $grandTotalRevenue,
        ], 200);
    }

    public function userStatistics(Request $request)
    {
        $type = $request->input('type', 'month'); // Mặc định là thống kê theo tháng

        // Xử lý query dựa trên loại thống kê
        $query = DB::table('users')
            ->select(
                DB::raw('COUNT(*) as total_users'),
                DB::raw('YEAR(created_at) as year'),
            );
        if ($type == 'week') {
            // Thống kê theo tuần
            $query->addSelect(DB::raw('MONTH(created_at) as month'), DB::raw('FLOOR((DAY(created_at) - 1) / 7) + 1 as week_in_month'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'), DB::raw('week_in_month'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->orderBy('week_in_month', 'asc');
        } elseif ($type == 'quarter') {
            // Thống kê theo quý
            $query->addSelect(DB::raw('YEAR(created_at) as year'), DB::raw('QUARTER(created_at) as quarter'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('QUARTER(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('quarter', 'asc');
            
        } elseif ($type == 'year') {
            // Thống kê theo năm
            $query->addSelect(DB::raw('YEAR(created_at) as year'))
                ->groupBy(DB::raw('YEAR(created_at)'))
                ->orderBy('year', 'asc');
        } else {
            // Mặc định là thống kê theo tháng
            $query->addSelect(DB::raw('MONTH(created_at) as month'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc');
        }

        $listuser = $query->get();

        $totalUser = [];
        $grandTotalUsers = 0;

        foreach ($listuser as $index => $data) {
            // Cộng dồn số người dùng
            $currentUser = $data->total_users;
            $grandTotalUsers += $currentUser;

            // Thêm tỷ lệ tăng trưởng nếu không phải là ngày đầu tiên
            if ($index > 0) {
                $previousUser = $listuser[$index - 1]->total_users;

                $growthPercentage = 0;
                if ($previousUser > 0) {
                    $growthPercentage = (($currentUser - $previousUser) / $previousUser) * 100;
                }

                $data->growth_percentage = round($growthPercentage, 2) . ' %';
            } else {
                $data->growth_percentage = '0 %';
            }

            // Thêm dữ liệu vào mảng kết quả
            $totalUser[] = $data;
        }

        return response()->json([
            'message' => 'Thống kê người dùng',
            'Người dùng' => $totalUser,
            'Tổng tất cả người dùng' => $grandTotalUsers,
        ], 200);
    }
    public function orderStatistics(Request $request)
    {
        $type = $request->input('type', 'month'); // Mặc định là thống kê theo tháng

        // Xử lý query dựa trên loại thống kê
        $query = DB::table('tb_oders')
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(CASE WHEN order_status = "Đã Hoàn Thành" THEN 1 ELSE 0 END) as completed_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Chờ xử lý" THEN 1 ELSE 0 END) as pending_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Giao hàng thất bại" THEN 1 ELSE 0 END) as failed_delivery_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Đã hủy đơn hàng" THEN 1 ELSE 0 END) as cancelled_orders'),
                DB::raw('SUM(CASE WHEN order_status = "Đã Hoàn Thành" THEN total_amount ELSE 0 END) as total_revenue')
            );

        if ($type == 'day') {
            // Thống kê theo ngày
            $query->addSelect(DB::raw('MONTH(created_at) as month'), DB::raw('DAY(created_at) as day'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'), DB::raw('DAY(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->orderBy('day', 'asc');
        } elseif ($type == 'week') {
            // Thống kê theo tuần
            $query->addSelect(DB::raw('MONTH(created_at) as month'), DB::raw('FLOOR((DAY(tb_oders.created_at) - 1) / 7) + 1 as week_in_month'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('week_in_month'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->orderBy('week_in_month', 'asc');
        } elseif ($type == 'quarter') {
            // Thống kê theo quý
            $query->addSelect(DB::raw('QUARTER(created_at) as quarter'), DB::raw('MONTH(created_at) as month'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('QUARTER(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->orderBy('quarter', 'asc');
        } elseif ($type == 'year') {
            // Thống kê theo quý
            $query->addSelect(DB::raw('YEAR(created_at) as year'))
                ->groupBy(DB::raw('YEAR(created_at)'))
                ->orderBy('year', 'asc');
        } else {
            // Mặc định là thống kê theo tháng
            $query->addSelect(DB::raw('MONTH(created_at) as month'))
                ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc');
        }

        $orderStatistics = $query->get();

        $totalOrder = [];
        $grandTotalOrder = 0;
        $grandTotalComplete = 0;
        $grandTotalCancel = 0;
        $grandTotalRevenue = 0;
        $grandTotalPending = 0;
        $grandTotalFailedDelivery = 0;

        foreach ($orderStatistics as $index => $order) {
            $currentOrder = $order->total_orders;
            $currentComplete = $order->completed_orders;
            $currentCancel = $order->cancelled_orders;
            $currentRevenue = $order->total_revenue;
            $currentPending = $order->pending_orders;
            $currentFailedDelivery = $order->failed_delivery_orders;

            $grandTotalOrder += $currentOrder;
            $grandTotalComplete += $currentComplete;
            $grandTotalCancel += $currentCancel;
            $grandTotalRevenue += $currentRevenue;
            $grandTotalPending += $currentPending;
            $grandTotalFailedDelivery += $currentFailedDelivery;

            // Tính tỷ lệ tăng trưởng
            if ($index > 0) {
                $previousOrder = $orderStatistics[$index - 1]->total_orders;
                $previousComplete = $orderStatistics[$index - 1]->completed_orders;
                $previousCancel = $orderStatistics[$index - 1]->cancelled_orders;
                $previousRevenue = $orderStatistics[$index - 1]->total_revenue;
                $previousPending = $orderStatistics[$index - 1]->pending_orders;
                $previousFailedDelivery = $orderStatistics[$index - 1]->failed_delivery_orders;

                $growthPercentageOrder = $previousOrder != 0 ? (($currentOrder - $previousOrder) / $previousOrder) * 100 : 0;
                $growthPercentageComplete = $previousComplete != 0 ? (($currentComplete - $previousComplete) / $previousComplete) * 100 : 0;
                $growthPercentageCancel = $previousCancel != 0 ? (($currentCancel - $previousCancel) / $previousCancel) * 100 : 0;
                $growthPercentageRevenue = $previousRevenue != 0 ? (($currentRevenue - $previousRevenue) / $previousRevenue) * 100 : 0;
                $growthPercentagePending = $previousPending != 0 ? (($currentPending - $previousPending) / $previousPending) * 100 : 0;
                $growthPercentageFailDelivery = $previousFailedDelivery != 0 ? (($currentFailedDelivery - $previousFailedDelivery) / $previousFailedDelivery) * 100 : 0;
                

                $order->growth_percentageOrder = round($growthPercentageOrder, 2) . ' %';
                $order->growthPercentageComplete = round($growthPercentageComplete, 2) . ' %';
                $order->growthPercentageCancel = round($growthPercentageCancel, 2) . ' %';
                $order->growthPercentageRevenue  = round($growthPercentageRevenue, 2) . ' %';
                $order->growthPercentagePending = round($growthPercentagePending, 2) . ' %';
                $order->growthPercentageFailDelivery  = round($growthPercentageFailDelivery, 2) . ' %';
            } else {
                $order->growth_percentageOrder = '0 %';
                $order->growthPercentageComplete = '0 %';
                $order->growthPercentageCancel = '0 %';
                $order->growthPercentageRevenue = '0 %';
                $order->growthPercentagePending = '0 %';
                $order->growthPercentageFailDelivery = '0 %';
            }

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
            'message' => 'Thống kê đơn hàng',
            'Tổng đơn hàng' => $totalOrder,
            'Tổng tất cả đơn hàng' => $grandTotalOrder,
            'Tổng tất cả đơn hàng thành công' => $grandTotalComplete,
            'Tổng tất cả đơn hàng hủy' => $grandTotalCancel,
            'Tổng tất cả đơn hàng chờ xử lý' => $grandTotalPending,
            'Tổng tất cả đơn hàng giao hàng thất bại' => $grandTotalFailedDelivery,
            'Tổng tỉ lệ hoàn thành đơn hàng' => $completionRate,
            'Tổng tỉ lệ hủy đơn hàng' => $cancellationRate,
            'Tổng doanh thu' => $grandTotalRevenue,
        ], 200);
    }
}
