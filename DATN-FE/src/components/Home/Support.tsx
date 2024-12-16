import React from "react";
import { Card, Collapse, Typography, Row, Col, Timeline, Alert, Divider } from "antd";
import {
  QuestionCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  MedicineBoxOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  MailOutlined
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const Support = () => {
  return (
    <div className="container py-5">
      <div style={{ marginTop: 50 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a
            href="/"
            className="stext-109 cl8 hov-cl1 trans-04"
          >
            Trang chủ
            <i
              className="fa fa-angle-right m-l-9 m-r-10"
              aria-hidden="true"
            ></i>
          </a>
          <span className="stext-109 cl4">Chính sách</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-4 mt-5">
        <Title level={1} className="mb-3">
          Chính sách đổi trả hàng
        </Title>
        <Alert
          message="Thời gian đổi trả: 15 ngày kể từ ngày đặt hàng"
          type="info"
          showIcon
          className="mb-3"
        />
        <Paragraph className="text-muted">
          Chúng tôi sẵn lòng trao đổi hoặc hoàn lại tiền cho một mặt hàng bạn đã mua từ chúng tôi - chỉ cần liên hệ trong vòng 15 ngày kể từ ngày bạn đặt hàng.
        </Paragraph>
      </div>

      {/* Return Process Timeline */}
      <Row gutter={[24, 24]} className="mb-4">
        <Col xs={24} lg={12}>
          <Card title="Quy trình đổi trả hàng" className="h-100 shadow-sm">
            <Timeline
              items={[
                {
                  color: "blue",
                  children: "Liên hệ với bộ phận CSKH",
                  dot: <MailOutlined className="text-primary" />
                },
                {
                  color: "blue",
                  children: "Cung cấp thông tin đơn hàng và lý do đổi trả",
                  dot: <ShoppingOutlined className="text-primary" />
                },
                {
                  color: "blue",
                  children: "Nhận hướng dẫn đóng gói và gửi hàng",
                  dot: <SyncOutlined className="text-primary" />
                },
                {
                  color: "blue",
                  children: "Chờ xác nhận và hoàn tiền (2-5 ngày làm việc)",
                  dot: <ClockCircleOutlined className="text-primary" />
                }
              ]}
            />
          </Card>
        </Col>

        {/* Return Conditions */}
        <Col xs={24} lg={12}>
          <Card title="Điều kiện đổi trả" className="h-100 shadow-sm">
            <Collapse defaultActiveKey={['1']} ghost>
              <Panel header="Đổi ý" key="1" extra={<SyncOutlined />}>
                <Paragraph>
                  Sản phẩm phải còn nguyên vẹn, chưa mở và chưa sử dụng.
                </Paragraph>
              </Panel>
              <Panel header="Sản phẩm lỗi" key="2" extra={<BugOutlined />}>
                <Paragraph>
                  Vui lòng cung cấp mô tả chi tiết và ảnh minh họa về lỗi sản phẩm.
                </Paragraph>
              </Panel>
              <Panel header="Bị dị ứng" key="3" extra={<MedicineBoxOutlined />}>
                <Paragraph>
                  Ngừng sử dụng ngay và gửi ảnh để chúng tôi xử lý.
                </Paragraph>
              </Panel>
              <Panel header="Sản phẩm không đúng/Hỏng do vận chuyển" key="4" extra={<ExclamationCircleOutlined />}>
                <Paragraph>
                  Chụp ảnh sản phẩm và liên hệ trong vòng 7 ngày.
                </Paragraph>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Card title="Câu hỏi thường gặp (FAQ)" className="shadow-sm">
        <Collapse defaultActiveKey={['1']} expandIconPosition="end">
          <Panel
            header="Làm sao để tôi biết được yêu cầu đổi trả của tôi đã được chấp nhận?"
            key="1"
            extra={<QuestionCircleOutlined />}
          >
            <Paragraph>
              Sau khi chúng tôi nhận được yêu cầu đổi trả của bạn, chúng tôi sẽ gửi email thông báo kết quả.
              Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ qua email.
            </Paragraph>
          </Panel>
          <Panel
            header="Tôi cần gửi lại sản phẩm trong bao lâu?"
            key="2"
            extra={<QuestionCircleOutlined />}
          >
            <Paragraph>
              Bạn cần gửi sản phẩm trong vòng 15 ngày kể từ ngày nhận hàng.
            </Paragraph>
          </Panel>
        </Collapse>

        <Divider />

        <Alert
          message="Cần hỗ trợ thêm?"
          description="Hãy liên hệ với chúng tôi qua zalo để chúng tôi có thể hỗ trợ nhanh nhất."
          type="success"
          showIcon
          className="mt-4"
        />
      </Card>
    </div>
  );
};

export default Support;