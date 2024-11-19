import React from "react";
import { Modal, Button, Spin } from "antd";
import { IProductDetail } from "./Type";
import { DetailImage, ProductImage } from "./ProductImage";


interface ProductDetailModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  product: IProductDetail | null;
  categories: any[];
  brands: any[];
  sizes: any[];
  colors: any[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  onClose,
  loading,
  product,
  categories,
  brands,
  sizes,
  colors,
}) => {
  if (!visible) return null;

  return (
    <Modal
      title={
        <div className="d-flex align-items-center border-bottom pb-3">
          <h4 className="mb-0 text-primary">Chi tiết sản phẩm</h4>
          {product && <span className="ms-2 badge bg-secondary">{product.id}</span>}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="close" onClick={onClose} className="px-4">
          Close
        </Button>,
      ]}
    >
      {loading ? (
        <LoadingView />
      ) : product ? (
        <ProductDetailContent
          product={product}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
        />
      ) : (
        <EmptyView />
      )}
    </Modal>
  );
};

const LoadingView = () => (
  <div className="d-flex justify-content-center py-5">
    <Spin size="large" />
  </div>
);

const EmptyView = () => (
  <div className="text-center py-5 text-muted">
    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
    No product details available
  </div>
);

const ProductDetailContent: React.FC<{
  product: IProductDetail;
  categories: any[];
  brands: any[];
  sizes: any[];
  colors: any[];
}> = ({ product, categories, brands, sizes, colors }) => {
  return (
    <div className="container-fluid p-0">
      <div className="row g-4 mb-4">
        <BasicInformation 
          product={product}
          categories={categories}
          brands={brands}
        />
        <ProductImageSection image={product.image} />
      </div>
      <VariantsSection
        variants={product.variants}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
};

const BasicInformation: React.FC<{
  product: IProductDetail;
  categories: any[];
  brands: any[];
}> = ({ product, categories, brands }) => (
  <div className="col-md-7">
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title border-bottom pb-3 mb-3">
          Thông tin cơ bản
        </h5>
        <div className="row g-3">
          <InfoItem label="Name" value={product.name} />
          <InfoItem
            label="Category"
            value={categories.find((c) => c.id === product.tb_category_id)?.name}
          />
          <InfoItem
            label="Brand"
            value={brands.find((b) => b.id === product.tb_brand_id)?.name}
          />
          <InfoItem
            label="Status"
            value={
              <span
                className={`badge ${
                  product.status === "còn hàng"
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-danger"
                } px-3 py-2`}
              >
                {product.status}
              </span>
            }
          />
          <InfoItem
            label="Description"
            value={product.description || "N/A"}
            className="text-secondary"
          />
        </div>
      </div>
    </div>
  </div>
);

const InfoItem: React.FC<{
  label: string;
  value: React.ReactNode;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <div className="col-12">
    <div className="d-flex align-items-center">
      <span className="fw-semibold text-muted w-25">{label}:</span>
      <span className={className}>{value}</span>
    </div>
  </div>
);

const ProductImageSection: React.FC<{ image: string }> = ({ image }) => (
  <div className="col-md-5">
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex justify-content-center align-items-center">
        <DetailImage src={image} />
      </div>
    </div>
  </div>
);

const VariantsSection: React.FC<{
  variants: IProductDetail["variants"];
  sizes: any[];
  colors: any[];
}> = ({ variants, sizes, colors }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <h5 className="card-title d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
        <span>Biến thể sản phẩm</span>
        <span className="badge bg-primary">{variants.length}</span>
      </h5>

      <div
        className="variants-container"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            sizes={sizes}
            colors={colors}
          />
        ))}
      </div>
    </div>
  </div>
);

const VariantCard: React.FC<{
  variant: IProductDetail["variants"][0];
  sizes: any[];
  colors: any[];
}> = ({ variant, sizes, colors }) => (
  <div className="card mb-3 border shadow-sm">
    <div className="card-body">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="row g-2">
            <InfoItem
              label="Size"
              value={sizes.find((s) => s.id === variant.tb_size_id)?.name}
            />
            <InfoItem
              label="Color"
              value={colors.find((c) => c.id === variant.tb_color_id)?.name}
            />
            <InfoItem label="SKU" value={variant.sku} />
            <InfoItem
              label="Price"
              value={
                <span className="text-primary fw-semibold">
                  ${variant.price.toLocaleString()}
                </span>
              }
            />
            <InfoItem label="Quantity" value={variant.quantity} />
            <InfoItem
              label="Status"
              value={
                <span
                  className={`badge ${
                    variant.status === "còn hàng"
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  } px-3 py-2`}
                >
                  {variant.status}
                </span>
              }
            />
          </div>
        </div>

        {variant.images && variant.images.length > 0 && (
          <div className="col-md-6">
            <p className="fw-semibold text-muted mb-2">Variant Images:</p>
            <div className="row g-2">
              {variant.images.map((image: any, imgIndex) => (
                <div key={imgIndex} className="col-auto">
                  <ProductImage src={image?.name_image} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);