import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserStatsComponent from "./Dashboarddetail";
import RevenueDashboard from "./Dashboarddetail2";
import OrderStatistics from "./Dasshboarddetail3";
import ModalErrorr from "./Dasshboarddetail4";
import DashboardEror from "./Dashboarddetail5";
import ModalAllOrder from "./Dashboarddetail6";

const ToggleDashboard = () => {
  const navigate = useNavigate();  // Khai báo useNavigate

  const goBack = () => {
    navigate(-1);  // Điều hướng quay lại trang trước
  };

  return (
    <div>
      {/* Nút quay lại trang trước */}
      <Button
        onClick={goBack}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#080808",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Quay lại
      </Button>

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT NGƯỜI DÙNG CỦA SHOP
      </h2>
      <UserStatsComponent />

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT DOANH THU CỦA SHOP
      </h2>
      <RevenueDashboard />

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT ĐƠN HÀNG CỦA SHOP
      </h2>
      <ModalAllOrder />

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT ĐƠN HOÀN THÀNH CỦA SHOP
      </h2>
      <OrderStatistics />

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT ĐƠN HỦY CỦA SHOP
      </h2>
      <ModalErrorr />

      <h2
        style={{
          marginTop: "20px",
          color: "#333",
          fontWeight: "bold",
          backgroundColor: "#87CEFA",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        THÔNG TIN CHI TIẾT ĐƠN CHỜ VÀ ĐƠN THẤT BẠI CỦA SHOP
      </h2>
      <DashboardEror />
    </div>
  );
};

export default ToggleDashboard;
