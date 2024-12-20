import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  Button,
  Card,
  Space,
  Badge,
  Modal,
  Descriptions,
  Image,
  Spin,
  Empty,
  Input,
  message,
  TabsProps,
  Tabs,
} from "antd";
import {
  CheckCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  ApiResponse,
  CancellationModalProps,
  Order,
  OrderDetailModalProps,
} from "src/types/Myorder";
import { STATUS_CONFIG } from "./orderContant";
import styles from "./OrderDetails.module.css";
import axiosInstance from "src/config/axiosInstance";
import { Link } from "react-router-dom";
const { TextArea } = Input;

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  visible,
  onClose,
  onOpenRatingModal,
}) => {
  if (!order) return null;
  console.log(order);

  const config =
    STATUS_CONFIG[order.order_status as keyof typeof STATUS_CONFIG];
  return (
    <Modal
      title={
        <div className="text-xl font-bold">
          Chi tiết đơn hàng {order.order_code}
        </div>
      }
      open={visible}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      width={800}
      className="max-h-[90vh]"
      getContainer={false}
      style={{ zIndex: 1000 }}
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
            <span className={config?.textColor || "text-gray-600"}>
              {order.order_status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin khách hàng">
            <div className="space-y-1">
              <p>
                <span className="font-medium">Họ tên:</span> {order.name}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order.phone}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span> {order.address}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.email}
              </p>
            </div>
          </Descriptions.Item>
        </Descriptions>

        {/* Feedback Section */}
        {order.feedback && (
          <Descriptions bordered column={1} className="mb-6">
            <Descriptions.Item label="Nguyên nhân (Feedback)">
              <span>{order.feedback}</span>
            </Descriptions.Item>
          </Descriptions>
        )}

        <div className={styles.orderCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerTitle}>
              <h3 className={styles.title}>Chi tiết sản phẩm</h3>
              <span className={styles.productCount}>
                {order.oder_details?.length || 0} sản phẩm
              </span>
            </div>
          </div>

          <div className={styles.cardBody}>
            {order.oder_details?.map((detail, index) => (
              <div key={detail.id} className={styles.productItem}>
                <div className={styles.productContent}>
                  <div className={styles.productImage}>
                    <Image
                      src={`http://127.0.0.1:8000/storage/${detail.product.image}`}
                      alt={detail.product.name}
                      className={styles.productImg}
                      fallback="/placeholder.png"
                      preview={{
                        mask: (
                          <div className={styles.previewMask}>
                            <ShoppingCartOutlined
                              className={styles.previewIcon}
                            />
                            <span>Xem ảnh</span>
                          </div>
                        ),
                      }}
                    />
                  </div>

                  <div className={styles.productInfo}>
                    <div className={styles.productRow}>
                      <div className={styles.productNameCol}>
                        <Link to={`/product/${detail.product.id}`} className="product-link">
                          <h4 className={styles.productName}>
                            {detail.product.name}
                          </h4>
                        </Link>
                        {(detail.variant.size || detail.variant.color) && (
                          <div className={styles.variants}>
                            {detail.variant.size?.name && (
                              <span className={styles.variantBadge}>
                                {detail.variant.size.name}
                              </span>
                            )}
                            {detail.variant.color && (
                              <span className={styles.variantBadge}>
                                {detail.variant.color.name}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.priceCol}>
                        <div className={styles.priceInfo}>
                          <div className={styles.priceLabel}>Đơn giá</div>
                          <div className={styles.price}>
                            {detail.price.toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.quantityRow}>
                      <div className={styles.quantityCol}>
                        <div className={styles.quantityBadge}>
                          <span className={styles.quantityLabel}>
                            Số lượng:
                          </span>
                          <span className={styles.quantityValue}>
                            ×{detail.quantity}
                          </span>
                        </div>
                      </div>

                      <div className={styles.subtotalCol}>
                        <span className={styles.subtotalLabel}>
                          Thành tiền:
                        </span>
                        <span className={styles.subtotalValue}>
                          {(detail.price * detail.quantity).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    {!detail.is_reviewed &&
                      order.order_status == "Đã hoàn thành" && (
                        <div style={{ display: "flex", justifyContent: "end" }}>
                          <button
                            className={styles.ratingButton}
                            onClick={() =>
                              onOpenRatingModal(
                                detail.product,
                                order.id,
                                detail.id
                              )
                            }
                          >
                            Đánh giá
                          </button>
                        </div>
                      )}
                  </div>
                </div>

                {index < (order.oder_details?.length || 0) - 1 && (
                  <div className={styles.divider} />
                )}
              </div>
            ))}
          </div>

          {order.discount && (
            <div style={{ display: "flex", justifyContent: "end" }}>
              Mã giảm giá đã áp dụng: {order.discount.discount_code}
            </div>
          )}

          <div className={styles.cardFooter}>
            <div className={styles.footerContent}>
              <div className={styles.totalLabel}>
                <ShoppingCartOutlined className={styles.cartIcon} />
                <span>
                  Tổng tiền ({order.oder_details?.length || 0} sản phẩm) sau
                  giảm giá:
                </span>
              </div>
              <div className={styles.totalAmount}>
                {order.total_amount.toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const RatingModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  style?: React.CSSProperties;
}> = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      message.error("Vui lòng chọn số sao!");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
  };

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={visible}
      onCancel={() => {
        setRating(0);
        setComment("");
        onClose();
      }}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Đóng"
      style={{ zIndex: 2000 }}
    >
      <div className="space-y-4">
        <div className="text-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRatingClick(star)}
              style={{
                fontSize: 24,
                color: star <= rating ? "#FFD700" : "#ccc",
                cursor: "pointer",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <TextArea
          rows={4}
          placeholder="Nhập nhận xét của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          showCount
        />
      </div>
    </Modal>
  );
};

const CancellationModal: React.FC<CancellationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  orderId,
  loading,
  orderStatus,
}) => {
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (orderStatus === "Đã xử lí" && visible) {
      message.info("Đơn hàng đã được xác nhận và không thể hủy");
      setFeedback("");
      onClose();
    }
  }, [orderStatus, visible, onClose]);
  useEffect(() => {
    if (visible && orderStatus === "Đã xử lí") {
      message.info("Đơn hàng đã được xác nhận và không thể hủy");
      onClose();
    }
  }, [visible, orderStatus, onClose]);
  const handleConfirm = () => {
    // Double check status before confirming
    if (orderStatus === "Đã xử lí") {
      message.info("Đơn hàng đã được xác nhận và không thể hủy");
      onClose();
      return;
    }

    if (orderId) {
      onConfirm(orderId, feedback);
    }
  };

  return (
    <Modal
      title="Hủy đơn hàng"
      open={visible && orderStatus !== "Đã xử lí"}
      onCancel={() => {
        setFeedback("");
        onClose();
      }}
      confirmLoading={loading}
      okText="Xác nhận hủy"
      cancelText="Đóng"
      onOk={handleConfirm}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng:
        </p>
        <TextArea
          rows={4}
          placeholder="Nhập lý do hủy đơn hàng..."
          value={feedback}
          onChange={(e) => {
            // Only allow input if order is not confirmed
            if (orderStatus !== "Đã xử lí") {
              setFeedback(e.target.value);
            }
          }}
          className="w-full"
          maxLength={500}
          showCount
          disabled={orderStatus === "Đã xử lí"}
        />
      </div>
    </Modal>
  );
};

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenRatingModal = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: any,
    orderId: number,
    orderDetailId: number
  ) => {
    setCurrentProduct({
      ...product,
      order_id: orderId,
      orderdetail_id: orderDetailId,
    });
    setIsRatingModalVisible(true);
  };
  const handleReorder = async (clickOrder: number) => {
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/payment-reorder",
        data: { clickOrder },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.Message && response.data.Link) {
        Modal.confirm({
          title: "Thông báo",
          content: response.data.Message,
          okText: "Thanh toán",
          cancelText: "Hủy",
          onOk: () => {
            window.location.href = response.data.Link;
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      message.warning("Xin lỗi số lượng sản phẩm đã hết!");
    }
  };

  const handleConfirmDelivery = async (orderId: number) => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/api/confirm-order-client",
        {
          id: orderId,
          status: "Đã hoàn thành",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      message.success("Xác nhận đã nhận hàng thành công!");
      // Refresh the orders list
      window.location.reload();
    } catch (error) {
      console.error("Error confirming delivery:", error);
      message.error("Có lỗi xảy ra khi xác nhận. Vui lòng thử lại!");
    }
  };
  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!currentProduct) return;

    try {
      await axiosInstance.post(
        "http://127.0.0.1:8000/api/reviews",
        {
          id: currentProduct.orderdetail_id,
          tb_product_id: currentProduct.id,
          order_id: currentProduct.order_id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      message.success("Đánh giá thành công!");
      setIsRatingModalVisible(false);
    } catch (error) {
      console.log(error);
      message.error("Sản phẩm này đã đánh giá rồi!");
    }
  };

  const { data: orderData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/list-oder-client",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    },
  });

  // Cập nhật logic lọc đơn hàng
  const filteredOrders = React.useMemo(() => {
    if (!orderData?.data) return [];
    if (activeTab === "all") return orderData.data;
    return orderData.data.filter((order) => {
      const orderStatus = order.order_status.toLowerCase();
      const currentTab = activeTab.toLowerCase();
      return orderStatus === currentTab;
    });
  }, [orderData?.data, activeTab]);

  const handleCancelOrder = async (orderId: number, feedback: string) => {
    if (!feedback.trim()) {
      message.error("Vui lòng nhập lý do hủy đơn hàng!");
      return;
    }

    console.log("Cancelling order with ID:", orderId);

    setCancelLoading(true);
    try {
      const formData = {
        id: orderId,
        feedback: feedback,
        _method: "PUT",
      };

      console.log("Sending data:", formData);

      await axios({
        url: "http://127.0.0.1:8000/api/destroy-order-client",
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      message.success("Hủy đơn hàng thành công");
      setCancelModalVisible(false);
      setSelectedOrderId(null);
      window.location.reload();
    } catch (error) {
      console.error("Full error object:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  const showCancelModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelModalVisible(true);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      key: "order_code",
      render: (text: string) => (
        <span className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
          {text}
        </span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      key: "order_date",
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Thông tin khách hàng",
      key: "customer",
      render: (record: Order) => (
        <Space
          direction="vertical"
          size="small"
          className="text-gray-700 w-full"
        >
          <div className="font-medium">{record.name}</div>
          <div className="text-sm">📱 {record.phone}</div>
          <div className="text-sm">📍 {record.address}</div>
          <div className="text-sm font-semibold text-green-600">
            Tổng tiền: {record.total_amount.toLocaleString()}đ
          </div>
        </Space>
      ),
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (record: Order) => {
        const firstDetail = record.oder_details?.[0]; // Lấy sản phẩm đầu tiên
        const remainingCount = record.oder_details?.length - 1; // Số sản phẩm còn lại
        if (firstDetail) {
          console.log(
            "Image URL: ",
            `http://127.0.0.1:8000/storage/${firstDetail.product.image}`
          );
        }
        return (
          <div className="flex gap-2 flex-wrap">
            {firstDetail && (
              <div className="flex-shrink-0 text-center">
                <Image
                  src={`http://127.0.0.1:8000/storage/${firstDetail.product.image}`}
                  alt={firstDetail.product.name}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                  fallback="/placeholder.png"
                  preview={{
                    mask: (
                      <div className="text-xs text-center">
                        {firstDetail.product.name}
                      </div>
                    ),
                  }}
                />
                {/* Hiển thị số sản phẩm còn lại nếu có */}
                {remainingCount > 0 && (
                  <div className="text-xs text-center text-gray-500 mt-1">
                    +{remainingCount} sản phẩm khác
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      render: (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
          color: "default",
          icon: <ShoppingOutlined />,
          textColor: "text-gray-600",
        };

        return (
          <Badge
            status={config.color}
            text={
              <Space className={`${config.textColor} font-medium`}>
                {config.icon}
                {status}
              </Space>
            }
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: Order) => {
        const hasUnreviewedProducts = record.oder_details?.some(
          (detail) => !detail.is_reviewed
        );
        return (
          <Space size="middle">
            <Button
              type="primary"
              ghost
              onClick={() => {
                setSelectedOrder(record);
                setIsModalVisible(true);
              }}
            >
              Chi tiết
            </Button>
            {record.order_status === "Chưa thanh toán" && (
              <Button
                type="primary"
                onClick={() => handleReorder(record.id)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Mua lại
              </Button>
            )}
            {record.order_status === "Đã giao hàng" && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleConfirmDelivery(record.id)}
              >
                Xác nhận nhận hàng
              </Button>
            )}
            {record.order_status === "Đã hoàn thành" &&
              hasUnreviewedProducts && (
                <Button
                  style={{ border: "1px solid #FB8D00" }}
                  className="buttonReview"
                  onClick={() => {
                    setSelectedOrder(record);
                    setIsModalVisible(true);
                  }}
                >
                  Đánh giá
                </Button>
              )}

            {record.order_status === "Chờ xử lý" && (
              <Button
                danger
                className="hover:bg-red-50"
                onClick={() => showCancelModal(record.id)}
              >
                Hủy đơn
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // Cập nhật cấu hình tabItems để khớp với STATUS_CONFIG
  const tabItems: TabsProps["items"] = [
    {
      key: "all",
      label: (
        <span className="flex items-center">
          <ShoppingOutlined />
          <span className="ml-2">Tất cả</span>
        </span>
      ),
      children: null,
    },
    ...Object.entries(STATUS_CONFIG).map(([status, config]) => ({
      key: status, // Giữ nguyên key là status gốc
      label: (
        <span className={`flex items-center ${config.textColor}`}>
          {config.icon}
          <span className="ml-2">{status}</span>
        </span>
      ),
      children: null,
    })),
  ];

  return (
    <div>
      <div className="container" style={{ marginTop: 80 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
          </a>
          <span className="stext-109 cl4">Đơn hàng của tôi</span>
        </div>
      </div>

      <div className="min-h-screen flex flex-col" style={{ margin: "50px 0" }}>
        <div className="flex-grow container order mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </div>

          <Card className="shadow-lg rounded-lg mb-8">
            <div className="flex overflow-x-auto no-scrollbar mb-6"></div>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="order-tabs"
              type="card"
            />
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  pagination={{
                    pageSize: 5,
                    showTotal: (total, range) => (
                      <span className="text-gray-600">
                        {`${range[0]}-${range[1]} của ${total} đơn hàng`}
                      </span>
                    ),
                  }}
                  className="border rounded-lg"
                  rowClassName="hover:bg-gray-50"
                />
              </div>
            ) : (
              <Empty
                description={
                  <span className="text-gray-500">
                    Không có đơn hàng nào{" "}
                    {activeTab !== "all" ? "trong trạng thái này" : ""}
                  </span>
                }
                className="py-10"
              />
            )}
          </Card>
        </div>
        <OrderDetailModal
          order={selectedOrder}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedOrder(null);
          }}
          onOpenRatingModal={handleOpenRatingModal}
        />

        <CancellationModal
          visible={cancelModalVisible}
          onClose={() => {
            setCancelModalVisible(false);
            setSelectedOrderId(null);
          }}
          onConfirm={handleCancelOrder}
          orderId={selectedOrderId}
          loading={cancelLoading}
          orderStatus=""
        />

        <RatingModal
          visible={isRatingModalVisible}
          onClose={() => setIsRatingModalVisible(false)}
          onSubmit={handleRatingSubmit}
        />
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default MyOrder;
