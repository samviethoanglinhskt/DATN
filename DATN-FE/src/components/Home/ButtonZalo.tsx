import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

interface ButtonZaloProps {
  phoneNumber: string; // Số điện thoại Zalo cá nhân
  width?: string; // Chiều rộng của nút
  height?: string; // Chiều cao của nút
}

const ButtonZalo: React.FC<ButtonZaloProps> = ({
  phoneNumber = "g/vcbaey564",
  width = "60px",
  height = "60px",
}) => {
  const zaloLink = `https://zalo.me/${phoneNumber}`;
  const [showText, setShowText] = useState(false);

  // Toggle dòng chữ chạy
  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prev) => !prev);
    }, 4000); // 2 giây hiển thị + 2 giây ẩn
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="zalo-button-container"
      style={{
        position: "fixed",
        bottom: "60px",
        right: "30px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#0084FF",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: width,
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <img
          src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png"
          alt="Zalo"
          style={{ width: "46px", height: "46px", zIndex: 1 }}
        />
      </a>
      <div
        style={{
          position: "absolute",
          right: "60px",
          display: "flex",
          alignItems: "center",
          animation: showText ? "slideOut 2s forwards" : "slideIn 2s forwards",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "8px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
            fontSize: "15px"
          }}
        >
          Liên hệ với chúng tôi
        </Typography>
      </div>
      <style>
        {`
          @keyframes slideOut {
            0% {
              transform: translateX(50%);
              opacity: 0;
            }
            50% {
              opacity: 1;
              transform: translateX(0px);
            }
            100% {
              transform: translateX(0px);
            }
          }

          @keyframes slideIn {
            0% {
              transform: translateX(0px);
              opacity: 1;
            }
            50% {
              transform: translateX(0px);
              opacity: 1;
            }
            100% {
              transform: translateX(40%);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ButtonZalo;
