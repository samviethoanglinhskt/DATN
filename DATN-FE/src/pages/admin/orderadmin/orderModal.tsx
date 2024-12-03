import React, { useEffect, useState } from "react";
import { Image, Modal, Spin, message } from "antd";
import { STATUS_CONFIG } from "./orderContant";
import axios from "axios";
import dayjs from "dayjs";
import { OrderStatus } from "./ordertype";

interface OrderDetail {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  variant: {
    id: number;
    price: number;
    size: {
      name: string;
    };
    color: {
      name: string;
    } | null;
  };
}

interface DetailOrder {
  id: number;
  order_code: string;
  order_date: string;
  total_amount: number;
  order_status: OrderStatus;
  feedback: string | null;
  name: string;
  phone: string;
  address: string;
  email: string;
  oder_details: OrderDetail[];
}

interface OrderDetailModalProps {
  orderId?: number;
  visible: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  visible,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<DetailOrder | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId || !visible) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/show-oder-detail/${orderId}`
        );
        if (response.data.success) {
          setOrderDetail(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Không thể tải thông tin chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, visible]);

  if (!orderDetail && !loading) return null;

  const config = orderDetail ? STATUS_CONFIG[orderDetail.order_status] : null;

  return (
    <Modal
      title={
        <div className="fs-5 fw-bold">
          Chi tiết đơn hàng {orderDetail?.order_code}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="custom-modal"
    >
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <Spin size="large" />
        </div>
      ) : (
        orderDetail && (
          <div className="order-detail">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td className="bg-light" style={{ width: "30%" }}>
                    Ngày đặt
                  </td>
                  <td>{dayjs(orderDetail.order_date).format("DD/MM/YYYY")}</td>
                </tr>
                <tr>
                  <td className="bg-light">Trạng thái</td>
                  <td>
                    <span className={config?.textColor}>
                      {orderDetail.order_status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="bg-light">Thông tin khách hàng</td>
                  <td>
                    <div>
                      <p className="mb-2">
                        <span className="fw-medium">Họ tên:</span>{" "}
                        {orderDetail.name}
                      </p>
                      <p className="mb-2">
                        <span className="fw-medium">Số điện thoại:</span>{" "}
                        {orderDetail.phone}
                      </p>
                      <p className="mb-2">
                        <span className="fw-medium">Địa chỉ:</span>{" "}
                        {orderDetail.address}
                      </p>
                      <p className="mb-2">
                        <span className="fw-medium">Email:</span>{" "}
                        {orderDetail.email}
                      </p>
                      <p className="mb-0">
                        <span className="fw-medium">Lý do hủy:</span>{" "}
                        {orderDetail.feedback || "Không có"}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Chi tiết sản phẩm</h6>
                <span className="badge bg-primary">
                  {orderDetail.oder_details.length} sản phẩm
                </span>
              </div>

              <div className="border rounded p-3">
                {orderDetail.oder_details.map((detail) => (
                  <div
                    key={detail.id}
                    className="d-flex mb-3 pb-3 border-bottom"
                  >
                    <div
                      style={{ width: "80px", height: "80px" }}
                      className="me-3"
                    >
                      <Image
                        src="https://images2.thanhnien.vn/528068263637045248/2024/1/25/3b690baedbd9a609207c76684a3413d0-65a11b0a7e79d880-17061562931311973368410.jpg"
                        alt={detail.product.name}
                        width={80}
                        height={80}
                        className="img-fluid rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-medium mb-1">{detail.product.name}</h6>
                      <p className="text-muted small mb-2">
                        {detail.variant.size?.name}
                        {detail.variant.color &&
                          ` - ${detail.variant.color.name}`}
                      </p>
                      <div className="d-flex justify-content-between">
                        <span>Số lượng: {detail.quantity}</span>
                        <span className="fw-medium">
                          Đơn giá: {detail.price.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                  <div className="text-end">
                    <div className="text-muted mb-2">Tổng thanh toán</div>
                    <div className="fs-4 fw-bold text-danger">
                      {orderDetail.total_amount.toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </Modal>
  );
};

export default OrderDetailModal;
