import catDacha from "@/assets/cat-dacha.webp";
import catBaths from "@/assets/cat-baths.webp";
import catDachaModular from "@/assets/cat-dacha-modular.webp";
import catGuestModular from "@/assets/cat-guest-modular.webp";
import catHousesModular from "@/assets/cat-houses-modular.webp";
import catHousesPrefab from "@/assets/cat-houses-prefab.webp";
import catStudioModular from "@/assets/cat-studio-modular.webp";
import catTerrace from "@/assets/cat-terrace.webp";
import catTwostory from "@/assets/cat-twostory-modular.webp";
import catCafe from "@/assets/cat-cafe.webp";
import catCommercial from "@/assets/cat-commercial.webp";
import catGlampingBusiness from "@/assets/cat-glamping-biz.webp";
import catGuestBusiness from "@/assets/cat-guest-prefab.webp";
import catHotel from "@/assets/cat-hotel.webp";
import catOffice from "@/assets/cat-office.webp";
import { getCatalogCategoryBySlug } from "@/data/catalogCategories";
import { CATALOG_PATH } from "@/lib/siteRoutes";

export type CategoryLink = {
  title: string;
  caption: string;
  href: string;
  image: string;
};

const categoryPath = (slug: string) => getCatalogCategoryBySlug(slug)?.path ?? CATALOG_PATH;

/** Единый список категорий для главной, /categories и поиска. */
export const categoryLinks: CategoryLink[] = [
  {
    title: "Модульные дома",
    caption: "Готовые проекты заводской сборки",
    href: CATALOG_PATH,
    image: catHousesModular,
  },
  {
    title: "Модульные бани",
    caption: "Готовые бани заводской сборки",
    href: categoryPath("modulnye-bani"),
    image: catBaths,
  },
  {
    title: "Дома под ключ",
    caption: "С отделкой и готовой комплектацией",
    href: categoryPath("pod-klyuch"),
    image: catHousesModular,
  },
  {
    title: "Барнхаусы",
    caption: "Современная архитектура с террасами",
    href: categoryPath("barnhausy"),
    image: catHousesPrefab,
  },
  {
    title: "Дома до 3 млн",
    caption: "Компактные решения с понятным бюджетом",
    href: categoryPath("do-3-mln"),
    image: catStudioModular,
  },
  {
    title: "Дома 50–80 м²",
    caption: "Популярный размер для семьи",
    href: categoryPath("50-80-m2"),
    image: catGuestModular,
  },
  {
    title: "Дома для ПМЖ",
    caption: "Круглогодичное проживание",
    href: categoryPath("dlya-postoyannogo-prozhivaniya"),
    image: catTwostory,
  },
  {
    title: "Дома с террасой",
    caption: "Проекты для отдыха за городом",
    href: categoryPath("s-terrasoy"),
    image: catTerrace,
  },
  {
    title: "Мини-дома",
    caption: "Небольшие дома и студии",
    href: categoryPath("mini-doma"),
    image: catDachaModular,
  },
  {
    title: "Дачные дома",
    caption: "Сезонные и компактные проекты",
    href: categoryPath("dachnye"),
    image: catDacha,
  },
];

export const businessCategoryLinks: CategoryLink[] = [
  {
    title: "Глэмпинги",
    caption: "Модули для аренды и баз отдыха",
    href: `${CATALOG_PATH}?q=глэмпинг`,
    image: catGlampingBusiness,
  },
  {
    title: "Модульные отели",
    caption: "Готовые номера и гостиничные корпуса",
    href: `${CATALOG_PATH}?q=отель`,
    image: catHotel,
  },
  {
    title: "Офисы",
    caption: "Рабочие пространства быстрой сборки",
    href: `${CATALOG_PATH}?q=офис`,
    image: catOffice,
  },
  {
    title: "Кафе и павильоны",
    caption: "Коммерческие пространства под ключ",
    href: `${CATALOG_PATH}?q=кафе`,
    image: catCafe,
  },
  {
    title: "Коммерческие модули",
    caption: "Помещения для торговли и сервисов",
    href: `${CATALOG_PATH}?q=коммерческий`,
    image: catCommercial,
  },
  {
    title: "Гостевые дома",
    caption: "Для аренды и загородных комплексов",
    href: `${CATALOG_PATH}?q=гостевой дом`,
    image: catGuestBusiness,
  },
];

export const allCategoryLinks = [...categoryLinks, ...businessCategoryLinks];
