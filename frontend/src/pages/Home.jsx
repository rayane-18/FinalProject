// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

import "./styles.css";
import "swiper/swiper-bundle.css";
import { Frontpage } from "./Frontpage";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCreative,
} from "swiper/modules";

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
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        effect={"creative"}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        modules={[Autoplay, Pagination, Navigation, EffectCreative]}
        className="mySwiper"
        style={{ width: "100vw" }} // Set a fixed width for the Swiper container
      >
        <SwiperSlide>
          <img src={"/src/assets/1.jpg"} style={{ width: "100vw" }} alt="" />
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
      <div className="products" id="products">
        <h1 className="product-title">Products</h1>
        <div className="list"></div>
      </div>
      <div className="card">
        <h1>Card</h1>
        <ul className="listCard"></ul>
        <div className="checkOut">
          <div className="total">0</div>
          <div className="closeShopping">Close</div>
        </div>

        <script src="app.js"></script>
      </div>
      <div className="Promo" id="Learn-more">
        <h1>My Game List the best Game tracking website</h1>
        <div className="content">
          <div className="left">
            <div className="card-1">
              <h2>No more forgeting witch game you played</h2>
              <p>
                Thanks to MGL you can now just check on what games you played
                and wether or not you completed them
              </p>
            </div>
          </div>
          <div className="img-container">
            <img src="/src/assets/Mygames.png" alt="" />
          </div>
        </div>
      </div>
      <div className="Promo-2" id="Learn-more">
        <h1>Game region</h1>
        <div className="content">
          <div className="left">
            <div className="card-1">
              <p>
                with one click you can see game region and information about any
                game you want
              </p>
            </div>
          </div>
          <div className="img-container">
            <img src="/src/assets/Region.png" alt="" />
          </div>
        </div>
      </div>
      <div className="state">
        <div className="left">
          <img src="images/OldTownBooks.jpg" alt="" />
        </div>

        <div className="right" id="About">
          <h1>About me</h1>
          <p>am a solo fullstack developer making hobbist projects</p>
        </div>
      </div>

      <div className="footer" id="footer">
        <img src="/src/assets/logo.jpeg" alt="" />
        <div className="f-card">
          <h3>Contact :</h3>
          <p>555-eee-444</p>
          <p>rayane@gmail.com</p>
        </div>
        <div className="f-card">
          <h3>Socials</h3>
          <p>facebook : Rayane-MGL</p>
          <p>instagram : Rayane-MGL</p>
          <p>twitter : Rayane-MGL</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
