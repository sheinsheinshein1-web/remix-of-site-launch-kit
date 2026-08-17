import guideImage from "@/assets/cat-guide.webp";
import priceImage from "@/assets/cat-calculator.webp";
import compareImage from "@/assets/cat-compare.webp";
import wideHouseImage from "@/assets/wide-house-1.webp";
import wideHouseSecondImage from "@/assets/wide-house-2.webp";

export type JournalArticle = {
  slug: string;
  path: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const HOW_TO_CHOOSE_MODULAR_HOUSE_PATH = "/articles/kak-vybrat-modulnyy-dom";
export const COST_BREAKDOWN_ARTICLE_PATH = "/articles/iz-chego-skladyvaetsya-tsena";
export const FRAME_VS_MODULAR_ARTICLE_PATH = "/articles/karkasnyy-ili-modulnyy-dom";

export const homeArticles: JournalArticle[] = [
  {
    slug: "kak-vybrat-modulnyy-dom",
    path: HOW_TO_CHOOSE_MODULAR_HOUSE_PATH,
    title: "Как выбрать модульный дом",
    category: "Гайд",
    readTime: "7 минут",
    description: "На что смотреть в планировке, комплектации и договоре до заказа дома.",
    image: guideImage,
    coverImage: wideHouseImage,
    seoTitle: "Как выбрать модульный дом: планировка, комплектация, договор",
    seoDescription: "Разбираем, на что смотреть при выборе модульного дома: технология, площадь, уровень комплектации, утепление, сроки, доставка и условия договора.",
  },
  {
    slug: "iz-chego-skladyvaetsya-tsena",
    path: COST_BREAKDOWN_ARTICLE_PATH,
    title: "Из чего складывается цена",
    category: "Стоимость",
    readTime: "6 минут",
    description: "Домокомплект, отделка, фундамент, доставка и другие части итогового бюджета.",
    image: priceImage,
    coverImage: wideHouseSecondImage,
    seoTitle: "Из чего складывается цена модульного дома: расчёт бюджета",
    seoDescription: "Разбираем, что входит в цену модульного дома и какие расходы добавляются сверху: фундамент, доставка, монтаж, коммуникации и отделка.",
  },
  {
    slug: "karkasnyy-ili-modulnyy-dom",
    path: FRAME_VS_MODULAR_ARTICLE_PATH,
    title: "Каркасный или модульный дом",
    category: "Сравнение",
    readTime: "8 минут",
    description: "Сравниваем модульные и каркасные дома по срокам, цене за метр, свободе планировки, логистике и предсказуемости результата.",
    image: compareImage,
    coverImage: compareImage,
    seoTitle: "Каркасный или модульный дом: сравнение сроков, цены и планировок",
    seoDescription: "Сравниваем модульные и каркасные дома по срокам, цене за метр, свободе планировки, логистике и предсказуемости результата.",
  },
];

export const getJournalArticle = (slug: string) => homeArticles.find((article) => article.slug === slug);
