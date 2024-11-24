import React from "react";
import { Modal, Descriptions, Image } from "antd";
import { STATUS_CONFIG } from "./orderContant";
import { OrderDetailModalProps } from "./ordertype";


const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  visible,
  onClose,
}) => {
  if (!order) return null;

  const config = STATUS_CONFIG[order.order_status];

  return (
    <Modal
      title={<div className="text-xl font-bold">Chi tiết đơn hàng {order.order_code}</div>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="max-h-[90vh]"
    >
      <div className="overflow-y-auto">
        <Descriptions bordered column={1} className="mb-6">
          <Descriptions.Item label="Ngày đặt">
            {new Date(order.order_date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <span className={config.textColor}>
              {order.order_status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin khách hàng">
            <div className="space-y-1">
              <p><span className="font-medium">Họ tên:</span> {order.name}</p>
              <p><span className="font-medium">Số điện thoại:</span> {order.phone}</p>
              <p><span className="font-medium">Địa chỉ:</span> {order.address}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
            </div>
          </Descriptions.Item>
        </Descriptions>

        {order.oder_details && (
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
            <div className="space-y-4">
              {order.oder_details.map((detail) => (
                <div key={detail.id} className="flex items-center border-b pb-4">
                  <div className="w-20 h-20 mr-4">
                    <Image
                      src={`/storage/${detail.product.image}`}
                      alt={detail.product.name}
                      className="object-cover rounded"
                      fallback="/placeholder.png"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{detail.product.name}</h4>
                    <p className="text-gray-600">
                      {detail.variant.size?.name}
                      {detail.variant.color && ` - ${detail.variant.color.name}`}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span>Số lượng: {detail.quantity}</span>
                      <span>Giá: {detail.price.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <div className="text-xl font-bold">
            <span className="mr-4">Tổng thanh toán:</span>
            <span className="text-red-600">
              {order.final_amount
                ? order.final_amount.toLocaleString()
                : order.total_amount.toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;