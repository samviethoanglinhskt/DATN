import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Cấu hình Laravel Echo
const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});

// Lắng nghe sự kiện ProductLocked
echo.channel('products')
    .listen('ProductLocked', (e) => {
        console.log('Product has been locked:', e.variant);
        alert('Sản phẩm này đã bị khóa bởi người dùng khác.');
        // Cập nhật giao diện người dùng, ví dụ như điều hướng về trang sản phẩm
        window.location.href = '/';
    });

export default echo;
