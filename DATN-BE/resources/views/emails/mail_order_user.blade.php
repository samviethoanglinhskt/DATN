<div
    style="font-family: Arial, sans-serif; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <h4 style="color: #333;">Xin chào, {{ $name }}</h4>
    <p style="color: #666; line-height: 1.6;">Cảm ơn bạn đã mua hàng của Imperial Beauty</p>
    <p style="color: #666; line-height: 1.6;">Dưới đây là thông tin đơn hàng của bạn:</p>
    <h5 style="color: #555; margin: 10px 0;">Người đặt hàng: {{ $name }}</h5>
    <h5 style="color: #555; margin: 10px 0;">Số điện thoại: {{ $phone }}</h5>
    <h5 style="color: #555; margin: 10px 0;">Email: {{ $email }}</h5>
    <h5 style="color: #555; margin: 10px 0;">Địa chỉ nhận hàng: {{ $address }}</h5>
    <h5 style="color: #555; margin: 10px 0;">Mã đơn hàng: <strong style="color: #000;">{{ $orderCode }}</strong></h5>
    <h5 style="color: #555; margin: 10px 0;">Ngày đặt hàng: {{ $orderDate }}</h5>
    <h5 style="color: #555; margin: 10px 0;">Trạng thái đơn hàng: {{ $orderStatus }}</h5>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
            <tr>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2; color: #333;">Tên sản phẩm
                </th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2; color: #333;">Thuộc tính
                </th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2; color: #333;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2; color: #333;">Giá</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #f9f9f9;">
                <td style="border: 1px solid #ddd; padding: 10px;">{{ $productName }}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">
                    {{ $size }} {{ $color }}
                </td>
                <td style="border: 1px solid #ddd; padding: 10px;">{{ $orderDetail->quantity }}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">{{ $orderDetail->price }} VND</td>
            </tr>
            <tr style="background-color: #f9f9f9; border: 1px solid">
                Tổng tiền: {{ $totalAmount }} VND
            </tr>
        </tbody>
    </table>
    <p style="color: #666; line-height: 1.6;">Nếu có thắc mắc về đơn hàng vui lòng liên hệ với chúng tôi qua số điện
        thoại: <strong style="color: #000;">(+84) 767 148 662</strong>.</p>
    <p style="color: #666; line-height: 1.6;">Trân trọng,<br>Đội ngũ hỗ trợ của chúng tôi</p>
</div>
