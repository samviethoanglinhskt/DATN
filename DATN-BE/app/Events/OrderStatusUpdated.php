<?php

// app/Events/OrderStatusUpdated.php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $order;
    public $userId;

    public function __construct($order, $userId)
    {
        $this->order = $order;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new Channel('orders');
    }

    public function broadcastWith()
    {
        return [
            'order_id' => $this->order->id,
            'status' => $this->order->order_status,
            'user_id' => $this->userId,
        ];
    }
}
