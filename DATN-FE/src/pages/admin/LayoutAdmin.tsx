import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SkinOutlined,
  MessageOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
} from "antd";
import { NavLink, Outlet } from "react-router-dom";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "0",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="dashboard" className="text-decoration-none">
          Thống kê
        </NavLink>
      ),
    },
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: (
        <NavLink to="category" className="text-decoration-none">
          Danh Mục Sản Phẩm
        </NavLink>
      ),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: (
        <NavLink to="product" className="text-decoration-none">
          Quản Lý Sản Phẩm
        </NavLink>
      ),
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: (
        <NavLink to="order" className="text-decoration-none">
          Quản Lý Đơn Hàng
        </NavLink>
      ),
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: (
        <NavLink to="user" className="text-decoration-none">
          Quản Lý Tài Khoản
        </NavLink>
      ),
    },
    {
      key: "5",
      icon: <SkinOutlined />,
      label: "Thuộc Tính Sản Phẩm",
      children: [
        {
          key: "5-1",
          label: (
            <NavLink to="size" className="text-decoration-none">
              Quản Lý Kích Thước
            </NavLink>
          ),
        },
        {
          key: "5-2",
          label: (
            <NavLink to="color" className="text-decoration-none">
              Quản Lý Màu Sắc
            </NavLink>
          ),
        },
        {
          key: "5-3",
          label: (
            <NavLink to="brand" className="text-decoration-none">
              Quản Lý Thương Hiệu
            </NavLink>
          ),
        },
      ],
    },
    {
      key: "6",
      icon: <TagOutlined />,
      label: (
        <NavLink to="discount" className="text-decoration-none">
          Mã Giảm Giá
        </NavLink>
      ),
    },
    {
      key: "7",
      icon: <AppstoreAddOutlined />,
      label: (
        <NavLink to="banner" className="text-decoration-none">
          Quản Lý Banner
        </NavLink>
      ),
    },
    {
      key: "8",
      icon: <FileTextOutlined />,
      label: (
        <NavLink to="post" className="text-decoration-none">
          Bài viết
        </NavLink>
      ),
    },
    {
      key: "9",
      icon: <MessageOutlined />,
      label: (
        <NavLink to="review" className="text-decoration-none">
         Bình luận
        </NavLink>
      ),
    },
    {
      key: "10",
      icon: <MessageOutlined />,
      label: (
        <NavLink to="contact" className="text-decoration-none">
         Liên hệ
        </NavLink>
      ),
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh",backgroundColor: "#fff" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor:"white",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
        }}
      >
        <div
          className="logo"
          style={{
            height: "80px",
            margin: "16px",
            borderRadius: borderRadiusLG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/logoduan.jpg"
            alt="Shop Logo"
            style={{ height: "80px", width: "80px", borderRadius: "15px" }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["0"]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
        }}
      >
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/logoduan.jpg"
              alt="Shop Logo"
              style={{ height: "60px", width: "80px" }}
            />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
