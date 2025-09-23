import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import add_address_iamge from "./add_address_image.svg";
import banner3_image from "./banner3.png";
import logo4 from "./logo4.png";
import mask_image from "./mask.webp";
import pot_image from "./pot.jpg";
import Wewal from "./wewal1.jpg";
import Coconut_craft from "./coconut.jpg";
import wood_image from "./wood.jpg";
import beeralu from "./beeralu.jfif";
import jewelary from "./agasthi.webp";
import mayura from "./mayura.jfif";
import elephant1_image from "./elephant1.jpg";
import banner6 from "./bannerF.png";
import mainBanner from "./mainbanner.png";
import banner10 from "./banner10.png";
import banner_main from "./banner_main.png";
import mobile_banner from "./mobile_banner.png";  
import wewal_F from "./wewal_F.jfif";
import leaf_icon from "./leaf_icon.svg";
import beeralu_1 from "./beeralu_1.jpg";
import beeralu_2 from "./beeralu_2.jfif";



export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  add_address_iamge,
  box_icon,
  banner3_image,
  logo4,
  mask_image,
  pot_image,
  Wewal,
  Coconut_craft,
  wood_image,
  beeralu,
  jewelary,
  mayura,
  elephant1_image,
  banner6,
  mainBanner,
  banner10,
  banner_main,
  mobile_banner,
  wewal_F,
  leaf_icon,
  beeralu_1,
  beeralu_2,

};

export const categories = [
  {
    text: "Mask",
    path: "Masks",
    image: mask_image,
    bgColor: "#FEF6DA",
  },
  {
    text: "Clay Crafts",
    path: "ClayCrafts",
    image: pot_image,
    bgColor: "#FEE0E0",
  },
  {
    text: "Wewal",
    path: "wewal",
    image: Wewal,
    bgColor: "#F0F5DE",
  },
  {
    text: "Coconut Crafts",
    path: "CoconutCrafts",
    image: Coconut_craft,
    bgColor: "#E1F5EC",
  },
  {
    text: "Wood Crafts",
    path: "woodCrafts",
    image: wood_image,
    bgColor: "#FEE6CD",
  },
  {
    text: "Beeralu",
    path: "Beeralu",
    image: beeralu,
    bgColor: "#E0F6FE",
  },
  {
    text: "jewelary",
    path: "jewelary",
    image: jewelary,
    bgColor: "#F1E3F9",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fastest Delivery",
    description: "Items delivered in under 30 minutes.",
  },
  {
    icon: leaf_icon,
    title: "Handmade Guaranteed",
    description: " produce straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];

export const dummyProducts = [
  // Items
  {
    _id: "gd46g23h",
    name: "Raksha Mask",
    category: "masks",
    price: 2500,
    currency: "LKR",
    offerPrice: "",
    image: [mayura],
    description: [
      "Mayura Raksha Mask is a traditional Sri Lankan mask known for its vibrant colors and intricate designs.",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd47g34h",
    name: "Wooden Elephant",
    category: "woodCrafts",
    price: 30,
    currency: "LKR",
    offerPrice: "8000",
    image: [elephant1_image],
    description: [
     "sri lankan traditional wooden elephant handcraft",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  
  {
    _id: "gd48g45h",
    name: "Wewal Fruit Basket",
    category: "wewal",
    price: 30,
    currency: "LKR",
    offerPrice: 28,
    image: [wewal_F],
    description: [
      "Handcrafted Wewal Basket – eco-friendly, durable, and stylish. Perfect for storage, décor, or gifting, blending tradition with modern living.",
    ],
    createdAt: "2025-09-25T07:17:46.018Z",
    updatedAt: "2025-09-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd49g56h",
    name: "Agasthi Necklace",
    category: "jewelary",
    price: 2000,
    offerPrice: 1500,
    image: [jewelary],
    description: [
      "Agasthi Necklace – a masterpiece of Kandyan heritage, crafted with intricate detail and timeless elegance. This unique Sri Lankan jewelry piece reflects tradition, culture, and royal charm.",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd50g67h",
    name: "Beeralu Lace",
    category: "Beeralu",
    price: 1500,
    offerPrice: 1000,
    image: [beeralu_1],
    description: [
      "Beeralu lace – from fashion to home décor, a timeless touch of Sri Lankan heritage woven into modern style.",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
 /* {
    _id: "gd50g67k",
    name: "Table Runner",
    category: "Beeralu",
    price: 3000,
    offerPrice: 2000,
    image: [beeralu_2],
    description: [
      "Bring the timeless elegance of Walaw heritage to your table with handcrafted Beeralu lace.",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },*/
];



//address

export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];
