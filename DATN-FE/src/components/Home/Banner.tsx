import React, { useState, useEffect } from "react";

const Banner = () => {
  const items = [
    {
      id: 1,
      image: "src/assets/images/logo/1.png",
      title: "Thương Hiệu",
      subtitle: "Loreal",
      link: "/product/brand/1",
    },
    {
      id: 2,
      image: "src/assets/images/logo/2.png",
      title: "Mĩ Phẩm Làm Đẹp",
      subtitle: "Lemonade",
      link: "/product/brand/2",
    },
    {
      id: 3,
      image: "src/assets/images/logo/3.png",
      title: "Dưỡng Da",
      subtitle: "Cocoon",
      link: "/product/brand/3",
    },
    {
      id: 4,
      image: "src/assets/images/logo/4.jpg",
      title: "Mĩ Phẩm Làm Đẹp",
      subtitle: "Peripera",
      link: "/product/brand/4",
    },
    {
      id: 5,
      image: "src/assets/images/logo/5.png",
      title: "Mĩ Phẩm Làm Đẹp",
      subtitle: "Garnier",
      link: "/product/brand/6",
    },
    {
      id: 6,
      image: "src/assets/images/logo/6.png",
      title: "Dưỡng Da",
      subtitle: "La Roche-Posay",
      link: "/product/brand/7",
    },
    {
      id: 7,
      image: "src/assets/images/logo/7.png",
      title: "Mĩ Phẩm Làm Đẹp",
      subtitle: "CLUB CLIO",
      link: "/product/brand/8",
    },
    {
      id: 8,
      image: "src/assets/images/logo/8.png",
      title: "Dưỡng Da",
      subtitle: "OHUI",
      link: "/product/brand/9",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      (prevPage + 1) * itemsPerPage < items.length ? prevPage + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) =>
      prevPage === 0 ? Math.ceil(items.length / itemsPerPage) - 1 : prevPage - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // handleNext();
    }, 500); // Chuyển slide sau mỗi 5 giây

    return () => clearInterval(interval);
  }, [items.length, itemsPerPage]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div className="sec-banner bg0 p-t-80 p-b-50">
      <div className="container position-relative">
        {/* Nút chuyển hướng */}
        <button
          className="btn-prev"
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
          onClick={handlePrev}
        >
          &#8249;
        </button>
        <button
          className="btn-next"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
          onClick={handleNext}
        >
          &#8250;
        </button>

        <div className="row">
          {visibleItems.map((item) => (
            <div className="col-md-6 col-xl-4 p-b-30 m-lr-auto" key={item.id}>
              <div className="block1 wrap-pic-w">
                <img
                  src={item.image}
                  alt="IMG-BANNER"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <a
                  href={item.link}
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span
                      style={{ fontSize: 29 }}
                      className="block1-name  trans-04 p-b-8 text-white"
                    >
                      {item.title}
                    </span>
                    <span
                      style={{ fontSize: 25 }}
                      className="block1-info stext-104 trans-04 text-white"
                    >
                      {item.subtitle}
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
