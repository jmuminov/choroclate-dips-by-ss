import Slider from "react-slick";

export default function Home() {
  console.log("Home component rendered");

  // Example Instagram images
  const instagramImages = [
    "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/474372731_17892315405161720_5806499106601514650_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QEe--D9K8SDgkIPY2j8OqyYtyqc19jniFn32yq-Gy2MYySFwjTgF4ouf_1fV7qo_c8&_nc_ohc=vk758TT1a0gQ7kNvwGW-rz6&_nc_gid=I-GGJn31pZ9oSpnsfPkM0w&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzU1NTUwNzIzMDkxOTIxMjA5MA%3D%3D.3-ccb7-5&oh=00_AfG2JtieUzLOZoLKPy-UDl9KxR3CyNp-FoM6B6VSCRAskA&oe=6810AD71&_nc_sid=22de04",
    "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/475262326_17892200391161720_4689635467350156627_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QEe--D9K8SDgkIPY2j8OqyYtyqc19jniFn32yq-Gy2MYySFwjTgF4ouf_1fV7qo_c8&_nc_ohc=daPY96g0kT0Q7kNvwEXwKUi&_nc_gid=I-GGJn31pZ9oSpnsfPkM0w&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzU1NDc4Njk2NDA0Nzk4NzY0Mg%3D%3D.3-ccb7-5&oh=00_AfGkehGSlMkm5F-xF0dy5O6QGOl0_2zD4vVd7xjaDBXexg&oe=6810CD07&_nc_sid=22de04",
    "https://scontent-iad3-2.cdninstagram.com/v/t51.29350-15/464882226_1310348233455816_3170595110119831973_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=scontent-iad3-2.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2QEARY7-3Om1l-6xpTPmYHC-JVWCNjm3I9CRnRSTkmJLrycl7MB4y6hQG9YuEdT8nAY&_nc_ohc=MmYS779WRTsQ7kNvwEDyG9f&_nc_gid=Tt0FK29jAnzLOw9bxb12WQ&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzQ4OTEzODg3Nzg2NzI0MTY0Mw%3D%3D.3-ccb7-5&oh=00_AfGV7NgOjcTxSMA2_TG2t7TvoJUzdB_g4fVSzTWIHDJ33A&oe=6810A5B7&_nc_sid=22de04",
    "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/446521882_797565722336360_860697007788333015_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjMwMjR4MzAyNC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QEC_bN4Qkon37lmO0N036PQ966DZe3jswXpLgLYiB3K9hTAXyBqUqFGr0lrUTfcx34&_nc_ohc=9i3FF9yTMqkQ7kNvwEp2aoD&_nc_gid=bVhlG_0Nl-5nkBiOMFSnMw&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzM3NzQyNTMyODQ0NzU0MDkxMw%3D%3D.3-ccb7-5&oh=00_AfHYEloG3Jk6MSHubhzhPBL94oa5uWG2N7gWITNEtf_dSQ&oe=6810A884&_nc_sid=22de04",
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
