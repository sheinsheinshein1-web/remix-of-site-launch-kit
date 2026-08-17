import { CATALOG_PATH, MANUFACTURERS_PATH, REGIONS_PATH, getRegionPath } from "@/lib/siteRoutes";

export type SiteNavigationItem = {
  label: string;
  path: string;
};

export type SiteNavigationGroup = {
  type: "group";
  label: string;
  path: string;
  align?: "left" | "right";
  widthClassName: string;
  columnsClassName?: string;
  items: SiteNavigationItem[];
};

export type SiteNavigationLink = {
  type: "link";
  label: string;
  path: string;
};

export type SiteNavigationEntry = SiteNavigationGroup | SiteNavigationLink;

export const siteNavigation: SiteNavigationEntry[] = [
  {
    type: "group",
    label: "Проекты",
    path: CATALOG_PATH,
    widthClassName: "w-[560px]",
    columnsClassName: "grid-cols-2",
    items: [
      { label: "Все проекты", path: CATALOG_PATH },
      { label: "Модульные дома", path: `${CATALOG_PATH}?tech=Модульный%20дом` },
      { label: "Префаб-дома", path: `${CATALOG_PATH}?tech=Префаб` },
      { label: "Барнхаусы", path: `${CATALOG_PATH}?q=барнхаус` },
      { label: "Дома до 2 млн ₽", path: `${CATALOG_PATH}?maxPrice=2000000` },
      { label: "Дома до 3 млн ₽", path: `${CATALOG_PATH}?maxPrice=3000000` },
      { label: "Дома 50–80 м²", path: `${CATALOG_PATH}?minArea=50&maxArea=80` },
      { label: "Дома для ПМЖ", path: `${CATALOG_PATH}?q=пмж` },
      { label: "Дачные дома", path: `${CATALOG_PATH}?q=дача` },
    ],
  },
  {
    type: "group",
    label: "Производители",
    path: MANUFACTURERS_PATH,
    widthClassName: "w-[330px]",
    items: [
      { label: "Производители", path: MANUFACTURERS_PATH },
      { label: "Все производители", path: `${MANUFACTURERS_PATH}?sort=name` },
      { label: "Проверенные производители", path: `${MANUFACTURERS_PATH}?verified=true` },
      { label: "Производители по регионам", path: REGIONS_PATH },
      { label: "Как формируется рейтинг", path: `${MANUFACTURERS_PATH}#rating-methodology` },
    ],
  },
  {
    type: "group",
    label: "Регионы",
    path: REGIONS_PATH,
    align: "left",
    widthClassName: "w-[390px]",
    columnsClassName: "grid-cols-2",
    items: [
      { label: "Все регионы", path: REGIONS_PATH },
      { label: "Москва", path: getRegionPath("moskva") },
      { label: "Санкт-Петербург", path: getRegionPath("sankt-peterburg") },
      { label: "Екатеринбург", path: getRegionPath("ekaterinburg") },
      { label: "Казань", path: getRegionPath("kazan") },
      { label: "Краснодар", path: getRegionPath("krasnodar") },
      { label: "Нижний Новгород", path: getRegionPath("nizhniy-novgorod") },
    ],
  },
  {
    type: "link",
    label: "О сервисе",
    path: "/#faq",
  },
  {
    type: "link",
    label: "Журнал",
    path: "/articles",
  },
];
