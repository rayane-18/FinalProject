// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import "swiper/swiper-bundle.css";
import { Frontpage } from "./Frontpage";
import { Pagination, Navigation } from "swiper/modules";

const Home = () => {
  // Use useRef to create a reference to the Swiper container

  // Initialize Swiper when the component mount

  return (
    <div>
      <div>
        {" "}
        <Frontpage />
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={3}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{ delay: 3 }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        style={{ width: "100vw" }} // Set a fixed width for the Swiper container
      >
        <SwiperSlide>
          <img src={"/src/assets/1.jpg"} style={{ width: "99vw" }} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={"/src/assets/2.jpg"} style={{ width: "100vw" }} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={"/src/assets/3.jpg"} style={{ width: "100vw" }} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={"/src/assets/4.jpg"} style={{ width: "100vw" }} alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;
