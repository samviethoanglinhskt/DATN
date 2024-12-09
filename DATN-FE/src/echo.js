    import Echo from 'laravel-echo';
    import Pusher from 'pusher-js';
    import axios from 'axios';

    // Cấu hình Laravel Echo
    const echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true
    });
  // Hàm để lấy thông tin người dùng từ API 
  async function getCurrentUserId() { 
    try { 
        const response = await axios.get('http://127.0.0.1:8000/api/verify-token', { 
            headers: { 
                Authorization: `Bearer ${sessionStorage.getItem('token')}` 
            } 
        }); 
        return response.data.user.id; // Lấy user_id từ response 
        } catch (error) { 
            console.error('Token không hợp lệ hoặc không thể xác minh:', error); 
            return null; 
        } 
    }

//    // Lắng nghe sự kiện ProductLocked 
//    echo.channel('products') 
//    .listen('ProductLocked', async (e) => { 
//     console.log('Received event ProductLocked:', e); 
//     console.log('Product ID:', e.variant.id); 
//     console.log('Locked by User ID:', e.user_id); 
//     const currentUserId = await getCurrentUserId(); 
//     // Lấy user_id hiện tại 
//     console.log('Current User ID:', currentUserId); 
//     if (String(e.user_id) !== String(currentUserId)) { 
//         alert('Sản phẩm này đã bị mua bởi người dùng khác.'); 
//         window.location.href = '/'; 
//         } 
//     });

    // Lắng nghe sự kiện OrderStatusUpdated 
    echo.channel('orders') 
    .listen('OrderStatusUpdated', async (e) => { 
        console.log('Received event OrderStatusUpdated:', e); 
        const currentUserId = await getCurrentUserId(); // Lấy user_id hiện tại 
        console.log('Current User ID:', currentUserId); 
        if (String(e.user_id) === String(currentUserId)) { 
            alert(`Trạng thái đơn hàng của bạn đã được cập nhật thành: ${e.status}`);
            window.location.href = '/myoder'
            // // Cập nhật giao diện người dùng để vô hiệu hóa chức năng hủy đơn hàng nếu trạng thái là Đã xử lý, Đang giao hàng hoặc Đã giao hàng 
            // if (e.status === 'Đã xử lý' || e.status === 'Đang giao hàng' || e.status === 'Đã giao hàng') { 
            //     // Cập nhật logic để vô hiệu hóa chức năng hủy đơn hàng 
            //     // Ví dụ: cập nhật state của React hoặc UI của bạn 
            // } 
        } 
    });
    export default echo;
