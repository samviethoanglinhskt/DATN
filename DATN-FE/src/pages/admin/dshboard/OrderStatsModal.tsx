// import React, { useState, useEffect } from "react";
// import { Card, Table, Space, Empty, Spin, message, Modal, Button } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

// interface OrderStats {
//   total_orders: number;
//   year: number;
//   completed_orders: string;
//   month: number;
//   growthPercentageComplete: string;
// }

// interface DashboardData {
//   "Tổng đơn hàng": OrderStats[];
//   "Tổng tất cả đơn hàng thành công": number;
// }

// const OrderDashboard: React.FC = () => {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false); // State điều khiển modal

//   // Fetch dữ liệu
//   const fetchOrderStats = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://127.0.0.1:8000/api/statistics/order`);
//       if (!response.ok) throw new Error("Failed to fetch order statistics");
//       const result = await response.json();
//       setData(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       message.error("Không thể tải dữ liệu thống kê");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderStats();
//   }, []);

//   // Component hiển thị biểu tượng tăng trưởng
//   const GrowthIndicator: React.FC<{ value: string }> = ({ value }) => {
//     const numValue = parseFloat(value.replace(" %", ""));
//     return (
//       <Space>
//         {numValue !== 0 && (
//           numValue > 0 ? (
//             <ArrowUpOutlined style={{ color: "#52c41a" }} />
//           ) : (
//             <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
//           )
//         )}
//         <span style={{
//           color: numValue > 0 ? "#52c41a" : numValue < 0 ? "#ff4d4f" : "inherit",
//           fontWeight: "bold"  // Làm đậm chữ
//         }}>
//           {value}
//         </span>
//       </Space>
//     );
//   };

//   // Cấu hình các cột của bảng
//   const columns: ColumnsType<OrderStats> = [
//     {
//       title: "Thời gian",
//       key: "time",
//       render: (_, record) => `${record.month}/${record.year}`,
//       width: 120,
//       fixed: "left",
//       align: 'center', 
//     },
//     {
//       title: "Đơn hoàn thành",
//       children: [
//         {
//           title: "Số lượng",
//           dataIndex: "completed_orders",
//           width: 150,
//           align: 'center', // Căn giữa cột số lượng
//           render: (text) => <strong>{text}</strong>,
//         },
//         {
//           title: "Tăng trưởng",
//           dataIndex: "growthPercentageComplete",
//           width: 150,
//           align: 'center', // Căn giữa cột tăng trưởng
//           render: (value) => <GrowthIndicator value={value} />,
//         },
//       ],
//     },
//   ];

//   // Mở modal
//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   // Đóng modal
//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   // Khi dữ liệu đang tải
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", padding: "50px" }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   // Khi không có dữ liệu
//   if (!data) {
//     return <Empty description="Không có dữ liệu" />;
//   }

//   return (
//     <div>
//       <Card title="Chi tiết đơn hàng hoàn thành theo thời gian">
//         {/* Nút mở Modal */}
//         <Button type="primary" onClick={showModal}>
//           Xem Chi Tiết
//         </Button>
//       </Card>

//       {/* Modal hiển thị bảng */}
//       <Modal
//         title="Chi tiết đơn hàng hoàn thành theo thời gian"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null} // Tắt footer của modal
//         width={1000} // Điều chỉnh chiều rộng của modal
//       >
//         <Table
//           columns={columns}
//           dataSource={data["Tổng đơn hàng"]}
//           rowKey={(record) => `${record.month}-${record.year}`}
//           pagination={{
//             showSizeChanger: true,
//             showTotal: (total) => `Tổng ${total} bản ghi`,
//           }}
//           scroll={{ x: 700 }}  // Điều chỉnh độ rộng bảng
//           size="middle"
//           summary={() => (
//             <Table.Summary fixed>
//               <Table.Summary.Row>
//                 <Table.Summary.Cell index={0}>
//                   <strong>Tổng cộng</strong>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell index={1} align="center">
//                   <strong>{data["Tổng tất cả đơn hàng thành công"]}</strong>
//                 </Table.Summary.Cell>
//                 <Table.Summary.Cell index={2} align="center">
//                   {data["Tổng đơn hàng"][0]?.growthPercentageComplete && (
//                     <GrowthIndicator
//                       value={data["Tổng đơn hàng"][0].growthPercentageComplete}
//                     />
//                   )}
//                 </Table.Summary.Cell>
//               </Table.Summary.Row>
//             </Table.Summary>
//           )}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default OrderDashboard;
