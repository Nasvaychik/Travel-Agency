import facebook_icon from "./facebook_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import earth from "./earth.png";
import headerimg from "./headerimg.png";

import { Compass, MapPin, UsersRound } from "lucide-react";
import user from "./profile_icon.png";

export const assets = {
  facebook_icon,
  instagram_icon,
  twitter_icon,
  earth,
  headerimg,
  user,
};

export const stepsData = [
  {
    title: "Местоположение",
    description:
      "Куда вы направляетесь? Мы подберем идеальное место для вашей поездки.",
    icon: MapPin,
  },
  {
    title: "Расстояние",
    description:
      "Расстояние от вашего местоположения. Выберите идеальное расстояние для вашей поездки.",
    icon: Compass,
  },
  {
    title: "Максимальное количество человек",
    description:
      "Максимальное количество человек. Выберите оптимальное количество человек для вашей поездки.",
    icon: UsersRound,
  },
];
