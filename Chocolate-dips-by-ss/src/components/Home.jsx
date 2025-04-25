import Slider from "react-slick";

export default function Home() {
  console.log("Home component rendered");

  // Example Instagram images
  const instagramImages = [
    "https://i.imgur.com/cEsx1e4.jpeg",
    "https://i.imgur.com/qNPk7uy.jpeg",
    "https://i.imgur.com/0UOLbKd.jpeg",
    "https://i.imgur.com/VfufQoL.jpeg",
  ];

  // Custom arrow components
  const PrevArrow = ({ onClick }) => (
    <button className="slider-arrow prev-arrow" onClick={onClick}>
      &#8592; {/* Left arrow symbol */}
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button className="slider-arrow next-arrow" onClick={onClick}>
      &#8594; {/* Right arrow symbol */}
    </button>
  );

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />, // Custom left arrow
    nextArrow: <NextArrow />, // Custom right arrow
  };

  return (
    <div className="home-container">
      <h2>Welcome to Chocolate Dips by SS</h2>

      {/* Slideshow */}
      <div className="slideshow-container">
        <Slider {...settings}>
          {instagramImages.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Instagram ${index + 1}`}
                className="slideshow-image"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
