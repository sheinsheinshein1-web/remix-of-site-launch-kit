export type CatalogCategoryFilter = {
  objectType?: "house" | "bath";
  completion?: string;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  terms?: string[];
};

export type CatalogCategoryPage = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  caption: string;
  metaTitle: string;
  metaDescription: string;
  contentHeading: string;
  contentParagraphs: string[];
  legacyQuery: string;
  filter: CatalogCategoryFilter;
};

/**
 * Curated, indexable catalog landings. Only stable categories with distinct
 * search intent belong here. Arbitrary filter combinations remain noindex.
 */
export const catalogCategories: CatalogCategoryPage[] = [
  {
    slug: "pod-klyuch",
    path: "/modulnye-doma/pod-klyuch/",
    title: "Дома под ключ",
    h1: "Модульные дома под ключ",
    caption: "Проекты с готовой отделкой и комплектацией для заселения",
    metaTitle: "Модульные дома под ключ: проекты и цены",
    metaDescription: "Каталог модульных домов под ключ от производителей. Сравнивайте проекты, площади, планировки, сроки производства и цены.",
    contentHeading: "Проекты модульных домов под ключ",
    contentParagraphs: [
      "В каталоге собраны модульные дома в комплектации под ключ: с внутренней отделкой, инженерными коммуникациями и готовыми вариантами планировок. Сравните площадь, количество спален, сроки производства и стоимость разных проектов.",
      "Точный состав комплектации зависит от производителя. Перед заказом уточните, входят ли в цену фундамент, доставка, монтаж, подключение коммуникаций, мебель и подготовка участка.",
    ],
    legacyQuery: "q=под ключ",
    filter: { objectType: "house", completion: "Под ключ" },
  },
  {
    slug: "barnhausy",
    path: "/modulnye-doma/barnhausy/",
    title: "Барнхаусы",
    h1: "Модульные дома в стиле барнхаус",
    caption: "Проекты с лаконичной архитектурой, высокими фасадами и террасами",
    metaTitle: "Модульные барнхаусы: проекты и цены",
    metaDescription: "Модульные дома в стиле барнхаус от российских производителей. Сравните проекты, планировки, площади, комплектации и цены.",
    contentHeading: "Проекты модульных барнхаусов",
    contentParagraphs: [
      "Барнхаус сочетает простую форму, выразительную двускатную крышу и современную планировку. В подборке представлены модульные проекты разной площади для постоянного проживания, дачи и загородной аренды.",
      "Сравнивайте варианты по цене, сроку производства, утеплению, количеству комнат и комплектации. Наличие террасы, панорамного остекления и второго света указано в характеристиках конкретного проекта.",
    ],
    legacyQuery: "q=барнхаус",
    filter: { objectType: "house", terms: ["барнхаус", "barnhouse"] },
  },
  {
    slug: "do-3-mln",
    path: "/modulnye-doma/do-3-mln/",
    title: "Дома до 3 млн",
    h1: "Модульные дома до 3 млн рублей",
    caption: "Компактные проекты с начальной ценой до 3 миллионов рублей",
    metaTitle: "Модульные дома до 3 млн рублей: проекты",
    metaDescription: "Каталог модульных домов стоимостью до 3 млн рублей. Сравните площади, планировки, комплектации, сроки и предложения производителей.",
    contentHeading: "Проекты модульных домов до 3 миллионов",
    contentParagraphs: [
      "В подборку входят проекты, стартовая стоимость которых не превышает 3 млн рублей. Это компактные дома и студии для дачи, гостевого размещения или первого этапа загородного строительства.",
      "Цена в карточке является ориентиром и может зависеть от региона доставки, комплектации, фундамента и монтажа. Проверяйте состав предложения и запрашивайте актуальный расчёт у производителя.",
    ],
    legacyQuery: "maxPrice=3000000",
    filter: { objectType: "house", maxPrice: 3_000_000 },
  },
  {
    slug: "50-80-m2",
    path: "/modulnye-doma/50-80-m2/",
    title: "Дома 50–80 м²",
    h1: "Модульные дома площадью 50–80 м²",
    caption: "Популярные проекты для пары или семьи",
    metaTitle: "Модульные дома 50–80 м²: проекты и цены",
    metaDescription: "Модульные дома площадью от 50 до 80 м². Сравните проекты, планировки, число спален, комплектации, сроки и цены производителей.",
    contentHeading: "Проекты домов от 50 до 80 квадратных метров",
    contentParagraphs: [
      "Модульный дом площадью 50–80 м² подходит для пары или небольшой семьи. В этом диапазоне встречаются планировки с одной, двумя или тремя спальнями, кухней-гостиной, санузлом и террасой.",
      "Используйте фильтры, чтобы уточнить бюджет, этажность, срок производства и требуемую комплектацию. В карточках проектов указаны базовые характеристики и регионы доступной доставки.",
    ],
    legacyQuery: "minArea=50&maxArea=80",
    filter: { objectType: "house", minArea: 50, maxArea: 80 },
  },
  {
    slug: "dlya-postoyannogo-prozhivaniya",
    path: "/modulnye-doma/dlya-postoyannogo-prozhivaniya/",
    title: "Дома для ПМЖ",
    h1: "Модульные дома для постоянного проживания",
    caption: "Утеплённые проекты для круглогодичного использования",
    metaTitle: "Модульные дома для постоянного проживания",
    metaDescription: "Каталог модульных домов для постоянного проживания. Сравните утепление, планировки, площади, комплектации, сроки и цены.",
    contentHeading: "Проекты модульных домов для круглогодичного проживания",
    contentParagraphs: [
      "Для постоянного проживания важны не только площадь и планировка, но и конструкция стен, утепление, отопление, вентиляция и подготовка инженерных коммуникаций. В подборке собраны проекты, которые производители позиционируют для ПМЖ или круглогодичного использования.",
      "При выборе учитывайте климат региона, характеристики фундамента, энергоэффективность и состав комплектации. Финальные технические параметры и возможность регистрации жилого дома необходимо подтвердить у производителя до заключения договора.",
    ],
    legacyQuery: "q=пмж",
    filter: { objectType: "house", terms: ["пмж", "постоянное проживание", "круглогодич"] },
  },
  {
    slug: "s-terrasoy",
    path: "/modulnye-doma/s-terrasoy/",
    title: "Дома с террасой",
    h1: "Модульные дома с террасой",
    caption: "Проекты с открытой или крытой зоной отдыха",
    metaTitle: "Модульные дома с террасой: проекты и цены",
    metaDescription: "Проекты модульных домов с террасой от производителей. Сравните площади, планировки, комплектации, сроки строительства и цены.",
    contentHeading: "Проекты модульных домов с террасой",
    contentParagraphs: [
      "Терраса расширяет жилое пространство и создаёт отдельную зону для отдыха рядом с домом. В каталоге представлены компактные дачные варианты и более просторные проекты для постоянного проживания.",
      "Площадь террасы и её включение в стоимость отличаются у разных производителей. Перед заказом уточните конструкцию основания, материал настила, наличие кровли и возможность изменить размеры.",
    ],
    legacyQuery: "q=терраса",
    filter: { objectType: "house", terms: ["террас"] },
  },
  {
    slug: "mini-doma",
    path: "/modulnye-doma/mini-doma/",
    title: "Мини-дома",
    h1: "Модульные мини-дома до 50 м²",
    caption: "Небольшие дома и студии для участка, дачи или аренды",
    metaTitle: "Модульные мини-дома до 50 м²: проекты",
    metaDescription: "Каталог модульных мини-домов площадью до 50 м². Сравните планировки, комплектации, сроки производства и цены.",
    contentHeading: "Компактные модульные дома до 50 м²",
    contentParagraphs: [
      "Мини-дома подходят для небольшого участка, дачи, гостевого размещения или арендного бизнеса. Компактная площадь помогает сократить бюджет и сроки, сохранив основные жилые зоны.",
      "В подборке можно сравнить студии и проекты с отдельной спальней, санузлом и кухней. Обратите внимание на ширину модулей, условия доставки и готовность комплектации к заселению.",
    ],
    legacyQuery: "maxArea=50",
    filter: { objectType: "house", maxArea: 50 },
  },
  {
    slug: "dachnye",
    path: "/modulnye-doma/dachnye/",
    title: "Дачные дома",
    h1: "Модульные дачные дома",
    caption: "Компактные проекты для сезонного отдыха и загородного участка",
    metaTitle: "Модульные дачные дома: проекты и цены",
    metaDescription: "Каталог модульных дачных домов от производителей. Сравните проекты, площади, планировки, комплектации, сроки и цены.",
    contentHeading: "Проекты модульных домов для дачи",
    contentParagraphs: [
      "Модульный дачный дом можно изготовить на производстве и быстро установить на подготовленном участке. В подборке собраны компактные проекты для сезонного отдыха, выходных и гостевого размещения.",
      "Сравнивайте площадь, планировку, утепление и комплектацию. Для использования зимой заранее уточните характеристики ограждающих конструкций, отопления и инженерных систем.",
    ],
    legacyQuery: "q=дача",
    filter: { objectType: "house", terms: ["дача", "дачный", "выходные"] },
  },
  {
    slug: "modulnye-bani",
    path: "/modulnye-bani/",
    title: "Модульные бани",
    h1: "Модульные бани под ключ",
    caption: "Готовые проекты бань заводской сборки",
    metaTitle: "Модульные бани под ключ: проекты и цены",
    metaDescription: "Каталог модульных бань от производителей. Сравните проекты, площади, комплектации, сроки изготовления и цены.",
    contentHeading: "Проекты модульных бань",
    contentParagraphs: [
      "Модульные бани изготавливают в заводских условиях и доставляют на подготовленный участок готовыми блоками. В каталоге можно сравнить площадь, планировку, комплектацию и сроки производства.",
      "Перед заказом уточните состав парной и моечной, тип печи, отделочные материалы, требования к фундаменту, стоимость доставки и подключения коммуникаций.",
    ],
    legacyQuery: "type=bath",
    filter: { objectType: "bath" },
  },
];

export const getCatalogCategoryBySlug = (slug = "") =>
  catalogCategories.find((category) => category.slug === slug);

export const getCatalogCategoryByPath = (path = "") => {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  return catalogCategories.find((category) => category.path === normalizedPath);
};

export const getCatalogCategoryByLegacyQuery = (searchParams: URLSearchParams) =>
  catalogCategories.find((category) => {
    const entries = Array.from(new URLSearchParams(category.legacyQuery).entries());
    return entries.length > 0 && entries.every(([key, value]) => searchParams.get(key) === value);
  });

type CatalogCategoryItem = {
  badge?: string;
  name: string;
  price: string;
  area: string;
  productType?: "house" | "bath" | "house-bath";
  purpose?: string;
  completion?: string;
  insulation?: string;
  style?: string;
  suitableFor: string[];
  features: string[];
};

const normalize = (value: string) => value.toLocaleLowerCase("ru").replace(/ё/g, "е");
const numberFromText = (value: string) => Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", "."));

export const matchesCatalogCategory = (
  item: CatalogCategoryItem,
  category?: CatalogCategoryPage,
) => {
  if (!category) return true;

  const { filter } = category;
  if (filter.objectType === "bath" && item.productType !== "bath") return false;
  if (filter.objectType === "house" && item.productType === "bath") return false;
  if (filter.completion && item.completion !== filter.completion) return false;

  const price = numberFromText(item.price);
  const area = numberFromText(item.area);
  if (filter.maxPrice !== undefined && (!Number.isFinite(price) || price > filter.maxPrice)) return false;
  if (filter.minArea !== undefined && (!Number.isFinite(area) || area < filter.minArea)) return false;
  if (filter.maxArea !== undefined && (!Number.isFinite(area) || area > filter.maxArea)) return false;

  if (filter.terms?.length) {
    const haystack = normalize([
      item.name,
      item.badge ?? "",
      item.purpose ?? "",
      item.completion ?? "",
      item.insulation ?? "",
      item.style ?? "",
      ...item.suitableFor,
      ...item.features,
    ].join(" "));
    if (!filter.terms.some((term) => haystack.includes(normalize(term)))) return false;
  }

  return true;
};
