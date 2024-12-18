<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\tb_variant;

class ProductLocked implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $variant;
    public $userId;

    public function __construct(tb_variant $variant,$userId)
    {
        $this->variant = $variant;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new Channel('products');
    }
    public function broadcastWith()
    {
        return ['variant' => $this->variant, 'user_id' => $this->userId];
    }
}


