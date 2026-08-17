import guideImage from "@/assets/cat-guide.webp";
import priceImage from "@/assets/cat-calculator.webp";
import compareImage from "@/assets/cat-compare.webp";

export const homeArticles = [
  {
    slug: "kak-vybrat-modulnyy-dom",
    title: "Как выбрать модульный дом",
    category: "Гайд",
    readTime: "7 минут",
    description: "На что смотреть в планировке, комплектации и договоре до заказа дома.",
    image: guideImage,
  },
  {
    slug: "iz-chego-skladyvaetsya-tsena",
    title: "Из чего складывается цена",
    category: "Стоимость",
    readTime: "6 минут",
    description: "Домокомплект, отделка, фундамент, доставка и другие части итогового бюджета.",
    image: priceImage,
  },
  {
    slug: "karkasnyy-ili-modulnyy-dom",
    title: "Каркасный или модульный дом",
    category: "Сравнение",
    readTime: "8 минут",
    description: "Сравниваем сроки, возможности планировки, логистику и стоимость технологий.",
    image: compareImage,
  },
];
