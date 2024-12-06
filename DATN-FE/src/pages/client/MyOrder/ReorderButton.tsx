import React, { useState } from "react";
import { Modal, message } from "antd";
import axios from "axios";

const ReorderButton = ({
  orderId,
  className,
}: {
  orderId: string;
  className: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReorder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/payment-reorder",
        { id: orderId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.Link) {
        window.location.href = response.data.Link;
      } else {
        message.error("Không thể tạo đơn hàng mới");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      message.error("Đã xảy ra lỗi khi đặt lại đơn hàng");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalVisible(true)}
        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      >
        Mua lại
      </button>

      <Modal
        title="Xác nhận mua lại"
        open={isModalVisible}
        onOk={handleReorder}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p>Bạn có chắc chắn muốn mua lại đơn hàng này?</p>
      </Modal>
    </>
  );
};

export default ReorderButton;
