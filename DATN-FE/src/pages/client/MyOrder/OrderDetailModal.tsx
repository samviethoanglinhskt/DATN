import React from "react";
import { Modal, Descriptions, Image } from "antd";
import { Order } from "src/types/model";
import "./OrderDetailModal.css";

interface OrderDetailModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, visible, onClose }) => {
  if (!order) return null;
  
  return (
    <Modal
      title={
        <div className="order-title">
          Chi tiết đơn hàng <span className="order-code">{order.order_code}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="order-detail-modal"
    >
      <div className="order-content">
        <Descriptions bordered column={1} className="order-descriptions">
          <Descriptions.Item label="Ngày đặt">
            {new Date(order.order_date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <span
              className={`status-tag ${
                order.order_status === "Hoàn thành"
                  ? "status-completed"
                  : order.order_status === "Đã hủy"
                  ? "status-cancelled"
                  : order.order_status === "Đang xử lý"
                  ? "status-processing"
                  : "status-pending"
              }`}
            >
              {order.order_status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin khách hàng">
            <div className="customer-info">
              <p><span className="info-label">Họ tên:</span> {order.name}</p>
              <p><span className="info-label">Số điện thoại:</span> {order.phone}</p>
              <p><span className="info-label">Địa chỉ:</span> {order.address}</p>
              <p><span className="info-label">Email:</span> {order.email}</p>
            </div>
          </Descriptions.Item>
        </Descriptions>

        <div className="products-section">
          <h3 className="section-title">Chi tiết sản phẩm</h3>
          <div className="product-list">
            {order.oder_details?.map((detail) => (
              <div key={detail.id} className="product-item">
                <div className="product-image">
                  <Image
                    src={`/storage/${detail.product.image}`}
                    alt={detail.product.name}
                    className="product-img"
                    fallback="/placeholder.png"
                  />
                </div>
                <div className="product-details">
                  <h4 className="product-name">{detail.product.name}</h4>
                  <p className="product-variant">
                    {detail.variant.size?.name}
                    {detail.variant.color && ` - ${detail.variant.color.name}`}
                  </p>
                  <div className="product-quantity">
                    <span className="detail-label">Số lượng:</span> {detail.quantity}
                  </div>
                  <div className="product-price">
                    <span className="detail-label">Giá:</span> {detail.price.toLocaleString()}đ
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="total-section">
          <div className="total-details">
            <span className="total-label">Tổng thanh toán:</span>
            <span className="total-amount">
              {(order.final_amount || order.total_amount).toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;