import tourImg01 from "../t1.jpg";
import tourImg02 from "../t2.jpg";
import tourImg03 from "../t3.jpg";
import tourImg04 from "../t4.jpg";
import tourImg05 from "../t5.jpg";
import tourImg06 from "../t6.jpg";
import tourImg07 from "../t7.jpg";

const tours = [
  {
    id: "01",
    title: "Вестминстерский мост",
    city: "Лондон",
    distance: 300,
    price: 10000,
    maxGroupSize: 10,
    desc: "Полюбуйтесь знаменитым Вестминстерским мостом, с которого открывается потрясающий вид на здание Парламента и Биг-Бен в самом сердце Лондона.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg01,
    featured: true,
  },
  {
    id: "02",
    title: "Бали, Индонезия",
    city: "Индонезия",
    distance: 400,
    price: 10000,
    maxGroupSize: 8,
    desc: "Отдохните в тропическом раю на Бали, в Индонезии, известном своими пляжами, джунглями и яркой культурой.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg02,
    featured: true,
  },
  {
    id: "03",
    title: "Заснеженные горы, Таиланд",
    city: "Тайланд",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Откройте для себя безмятежную красоту Снежных гор в Таиланде, которые идеально подходят для любителей приключений и природы.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg03,
    featured: true,
  },
  {
    id: "04",
    title: "Прекрасный восход солнца, Таиланд",
    city: "Тайланд",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Проснитесь пораньше, чтобы полюбоваться захватывающим восходом солнца над потрясающими пейзажами Таиланда.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg04,
    featured: true,
  },
  {
    id: "05",
    title: "Нуса-Пендия, Бали, Индонезия",
    city: "Индонезия",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Откройте для себя экзотическую красоту Нуса-Пендии, спокойного острова недалеко от Бали, с нетронутыми пляжами и кристально чистой водой.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg05,
    featured: false,
  },
  {
    id: "06",
    title: "Вишня цветет весной",
    city: "Япония",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Почувствуйте волшебство Японии весной, когда цветёт сакура, превращая страну в розовую сказку.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg06,
    featured: false,
  },
  {
    id: "07",
    title: "Холмен-Лофотенские острова",
    city: "Франция",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Познакомьтесь с суровой красотой Холмен-Лофотенских островов с их впечатляющими пейзажами, кристально чистой водой и оживлёнными рыбацкими деревнями.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg07,
    featured: false,
  },
  {
    id: "08",
    title: "Заснеженные горы, Таиланд",
    city: "Тайланд",
    distance: 500,
    price: 10000,
    maxGroupSize: 8,
    desc: "Посетите волшебные Снежные горы в Таиланде — место, где царит спокойствие и приключения, идеально подходящее для незабываемого отдыха.",
    availableDates: ["5-1-2025", "2-1-2025", "7-2-2025"],
    reviews: [
      {
        name: "Аноним",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg03,
    featured: false,
  },
];

export default tours;
