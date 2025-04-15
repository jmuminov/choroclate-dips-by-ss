export default function Menu() {
  console.log("Menu rendered");

  // Example menu items
  const menuItems = [
    {
      id: 1,
      name: "Chocolate Strawberry",
      price: "$5.99",
      image: "/images/strawberry.jpg",
    },
    {
      id: 2,
      name: "Chocolate Banana",
      price: "$4.99",
      image: "/images/banana.jpg",
    },
    {
      id: 3,
      name: "Chocolate Pretzel",
      price: "$3.99",
      image: "/images/pretzel.jpg",
    },
    {
      id: 4,
      name: "Chocolate Marshmallow",
      price: "$2.99",
      image: "/images/marshmallow.jpg",
    },
  ];
  return (
    <div className="menu-container">
      {menuItems.map((item) => (
        <div key={item.id} className="menu-item">
          <img src={item.image} alt={item.name} className="menu-item-image" />
          <p className="menu-item-name">{item.name}</p> {/* Name of the item */}
          <p className="menu-item-price">{item.price}</p>
          <button className="menu-item-button">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
