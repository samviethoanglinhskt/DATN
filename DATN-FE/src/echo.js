    import Echo from 'laravel-echo';
    import Pusher from 'pusher-js';
    import * as jwt_decode from 'jwt-decode';

    // Cấu hình Laravel Echo
    const echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true
    });

    // const userId = response.data.user_id; // Lấy user_id từ response
    // // Hàm lấy user_id từ JWT token
    // function getCurrentUserId() {
    //     const token = sessionStorage.getItem('token'); // Lấy token từ 
    //     if (!token) return null; // Nếu không có token, trả về null

    //     try {
    //         const decoded = jwt_decode(token); // Giải mã token
    //         return decoded.user_id; // Lấy user_id từ token đã giải mã
    //     } catch (error) {
    //         console.error('Token không hợp lệ hoặc không thể giải mã:', error);
    //         return null;
    //     }
    // }

    // Lắng nghe sự kiện ProductLocked
    echo.channel('products')
        .listen('ProductLocked', (e) => {
            console.log('Received event ProductLocked:', e);
            console.log('Product ID:', e.variant.id);
            console.log('Locked by User ID:', e.user_id);
            const currentUserId = getCurrentUserId();  ///// lỗi đoạn này
            console.log('Current User ID:', currentUserId);

            if (String(e.user_id) !== String(currentUserId)) {
                alert('Sản phẩm này đã bị khóa bởi người dùng khác.');
                // window.location.href = '/';
            }
        });

    export default echo;
