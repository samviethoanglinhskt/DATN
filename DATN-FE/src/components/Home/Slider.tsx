import { useEffect, useState } from "react";

interface Banner {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string | null;
}

const Slider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Cache API response in localStorage
  useEffect(() => {
    const fetchBanners = async () => {
      const cachedBanners = localStorage.getItem("banners");
      if (cachedBanners) {
        setBanners(JSON.parse(cachedBanners));
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/logo_banner");
        const data = await res.json();
        const filteredBanners = data.filter(
          (obj: Banner) => obj.id === 2 || obj.id === 3
        );
        setBanners(filteredBanners);
        localStorage.setItem("banners", JSON.stringify(filteredBanners));
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchBanners();
  }, []);

  // Debounce resize event
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 300); // Update only after 300ms of inactivity
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const bannerId2 = banners.find((banner) => banner.id === 2);
  const bannerId3 = banners.find((banner) => banner.id === 3);

  const getImageHeight = () => {
    if (windowWidth <= 768) {
      return "50vh"; // Mobile
    } else if (windowWidth <= 1024) {
      return "60vh"; // Tablet
    } else {
      return "100vh"; // Desktop
    }
  };

  return (
    <section
      className="section-slide"
      style={{ width: "100%", height: "100vh" }}
    >
      <div className="wrap-slick1" style={{ width: "100%", height: "100%" }}>
        <div className="slick1" style={{ width: "100%", height: "100%" }}>
          <img
            src={bannerId2?.image || "https://www.droppii.com/blog/kinh-nghiem-kinh-doanh-my-pham-online/"}
            className="item-slick1"
            style={{
              width: "100%",
              height: getImageHeight(),
              objectFit: "cover",
              objectPosition: "center",
            }}
            alt="Banner 2"
          />
          <img
            src={bannerId3?.image || "https://www.droppii.com/blog/kinh-nghiem-kinh-doanh-my-pham-online/"}
            className="item-slick1"
            style={{
              width: "100%",
              height: getImageHeight(),
              objectFit: "cover",
              objectPosition: "center",
            }}
            alt="Banner 3"
          />
        </div>
      </div>
    </section>
  );
};

export default Slider;
