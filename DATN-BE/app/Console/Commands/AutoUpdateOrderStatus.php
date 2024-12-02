<?php

namespace App\Console\Commands;

use App\Models\tb_oder;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoUpdateOrderStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:auto-update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tự động cập nhật trạng thái đơn hàng thành "Đã nhận hàng" sau 7 ngày giao hàng';

    /**
     * Execute the console command.
     */
    public function __construct()
    {
        parent::__construct();
    }
    public function handle()
    {
        $now = Carbon::now();
        // Lấy các đơn hàng "Đang giao hàng" và giao đã quá 7 ngày
        $orders = tb_oder::where('order_status', 'Đã giao hàng')
            ->where('delivered_at', '<=', $now->subMinutes(1))
            ->get();
        foreach ($orders as $order) {
            $order->order_status = 'Đã hoàn thành'; // Cập nhật trạng thái
            $order->save();
        }
        \Log::info('Đã cập nhật trạng thái các đơn hàng quá hạn.');
    }
}
