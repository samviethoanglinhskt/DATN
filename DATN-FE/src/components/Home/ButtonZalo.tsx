import React from "react";

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

  return (
    <div
      id="zalo-button-container"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
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
        }}
      >
        <img
          src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png"
          alt="Zalo"
          style={{ width: "30px", height: "30px" }}
        />
      </a>
    </div>
  );
};

export default ButtonZalo;
