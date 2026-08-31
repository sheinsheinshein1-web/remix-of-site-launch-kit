import logo from "@/assets/maker-platforma.webp";
import wide1 from "@/assets/wide-house-1.webp";
import wide2 from "@/assets/wide-house-2.webp";
import widePlan from "@/assets/wide-house-plan.webp";
import widePlan3d from "@/assets/wide-house-plan-3d.webp";
import barn1 from "@/assets/cabin-31-1.webp";
import barn2 from "@/assets/cabin-31-2.webp";
import barnPlan from "@/assets/cabin-31-plan.webp";
import barnPlan3d from "@/assets/cabin-31-plan-3d.webp";
import bear45_1 from "@/assets/bear-1.webp";
import bear45_2 from "@/assets/bear-2.webp";
import bear45Plan from "@/assets/bear-plan.webp";
import bear45Plan3d from "@/assets/bear-plan-3d.webp";
import bear77_1 from "@/assets/bear77-1.webp";
import bear77_2 from "@/assets/bear77-2.webp";
import bear77Plan from "@/assets/bear77-plan.webp";
import bear77Plan3d from "@/assets/bear77-plan-3d.webp";
import bear86_1 from "@/assets/bear86-1.webp";
import bear86_2 from "@/assets/bear86-2.webp";
import bear86Plan from "@/assets/bear86-plan.webp";
import bear86Plan3d from "@/assets/bear86-plan-3d.webp";
import bear134_1 from "@/assets/bear134-1.webp";
import bear134_2 from "@/assets/bear134-2.webp";
import bear134Plan from "@/assets/bear134-plan.webp";
import bear134Plan3d from "@/assets/bear134-plan-3d.webp";
import vast1 from "@/assets/vast140-1.webp";
import vast2 from "@/assets/vast140-2.webp";
import vastPlan from "@/assets/vast140-plan.webp";
import vastPlan3d from "@/assets/vast140-plan-3d.webp";
import bear168_1 from "@/assets/bear168-1.webp";
import bear168_2 from "@/assets/bear168-2.webp";
import bear168Plan from "@/assets/bear168-plan.webp";
import bear168Plan3d from "@/assets/bear168-plan-3d.webp";
import businessHero from "@/assets/platforma-business-hero.webp";
import businessObject from "@/assets/platforma-business-object.webp";
import productionCraft from "@/assets/platforma-production-craft.webp";
import productionFloor from "@/assets/platforma-production-floor.webp";
import productionTeam from "@/assets/platforma-production-team.webp";
import cutawayKitchen from "@/assets/platforma-cutaway-kitchen.webp";
import cutawayLiving from "@/assets/platforma-cutaway-living.webp";
import real01 from "@/assets/platforma-real-01.webp";
import real02 from "@/assets/platforma-real-02.webp";
import real03 from "@/assets/platforma-real-03.webp";
import real04 from "@/assets/platforma-real-04.webp";
import real05 from "@/assets/platforma-real-05.webp";
import real06 from "@/assets/platforma-real-06.webp";
import real07 from "@/assets/platforma-real-07.webp";
import real08 from "@/assets/platforma-real-08.webp";

export { logo as platformaLogo };
export { businessHero as platformaBusinessHero, businessObject as platformaBusinessObject };
export { productionCraft as platformaProductionCraft, productionFloor as platformaProductionFloor, productionTeam as platformaProductionTeam };
export { cutawayKitchen as platformaCutawayKitchen, cutawayLiving as platformaCutawayLiving };

export const platformaPortfolio = [
  { src: real01, alt: "Построенный коммерческий модуль Платформа" },
  { src: real02, alt: "Фасад реализованного коммерческого объекта" },
  { src: real03, alt: "Интерьер реализованного коммерческого объекта" },
  { src: real04, alt: "Построенная модульная баня Платформа" },
  { src: real05, alt: "Парная в реализованной модульной бане" },
  { src: real06, alt: "Построенный модульный объект с террасой" },
  { src: real07, alt: "Фасад реализованного модульного объекта" },
  { src: real08, alt: "Интерьер реализованного модульного объекта" },
];

export type PlatformaProject = {
  slug: string;
  name: string;
  collection: "TWIN" | "WIDE" | "BARN" | "BEAR" | "VAST";
  description: string;
  story: string;
  price: number;
  area: number;
  bedrooms: number;
  rooms: string;
  livingArea: string;
  terrace: string;
  ceiling: string;
  gallery: string[];
};

export const platformaProjects: PlatformaProject[] = [
  {
    slug: "twin-house",
    name: "TWIN HOUSE",
    collection: "TWIN",
    description: "Комплекс из дома, бани и большой общей террасы.",
    story: "Жилой модуль и баня объединены общей террасой. В доме предусмотрены кухня-гостиная, спальня и санузел; в бане есть отдельная парная и зона отдыха.",
    price: 3_102_000,
    area: 75,
    bedrooms: 1,
    rooms: "Дом, баня и общая терраса",
    livingArea: "26,85 м²",
    terrace: "31,55 м²",
    ceiling: "2,7 м",
    gallery: [
      "https://optim.tildacdn.com/stor6130-3934-4462-a637-643936306363/-/resize/1600x1200/-/format/webp/34561865.jpg.webp",
      "https://optim.tildacdn.com/tild6235-6339-4532-b938-366338323235/-/format/webp/23878263jpg.webp",
      "https://optim.tildacdn.com/tild3961-3064-4835-b364-303536373336/-/format/webp/96045897jpg.webp",
    ],
  },
  {
    slug: "wide-house",
    name: "WIDE HOUSE",
    collection: "WIDE",
    description: "Компактный одноэтажный дом с двумя спальнями и террасой.",
    story: "Внутри расположены две спальни, кухня, гостиная, санузел и прихожая. Панорамное остекление связывает общую зону с открытой террасой.",
    price: 5_480_000,
    area: 56.8,
    bedrooms: 2,
    rooms: "3 комнаты",
    livingArea: "46,4 м²",
    terrace: "10,36 м²",
    ceiling: "2,7 м",
    gallery: [wide1, wide2, widePlan3d, widePlan],
  },
  {
    slug: "barn-house",
    name: "BARN HOUSE 31 м²",
    collection: "BARN",
    description: "Компактный дом-студия с опцией террасы.",
    story: "Планировка объединяет спальню и гостиную, сохраняя отдельные кухню, санузел и прихожую. Большая терраса почти удваивает полезное пространство летом.",
    price: 1_680_000,
    area: 42.9,
    bedrooms: 1,
    rooms: "1 комната-студия",
    livingArea: "20 м²",
    terrace: "22,89 м²",
    ceiling: "2,7 м",
    gallery: [barn1, barn2, barnPlan3d, barnPlan],
  },
  {
    slug: "bear-house-45",
    name: "BEAR HOUSE 45 м²",
    collection: "BEAR",
    description: "Дом для двоих с террасой и панорамными окнами.",
    story: "Компактная планировка включает спальню, кухню-гостиную, санузел и крытую террасу. Подходит для пары, дачи или гостевого дома.",
    price: 2_207_000,
    area: 41,
    bedrooms: 1,
    rooms: "2 комнаты",
    livingArea: "28,6 м²",
    terrace: "12,34 м²",
    ceiling: "2,7 м",
    gallery: [bear45_1, bear45_2, bear45Plan3d, bear45Plan],
  },
  {
    slug: "bear-house-77",
    name: "BEAR HOUSE 77 м²",
    collection: "BEAR",
    description: "Дом с большой террасой и дополнительным входом.",
    story: "Две спальни расположены отдельно от общей кухни-гостиной. Просторная терраса и дополнительный вход подходят для постоянной семейной жизни.",
    price: 3_894_700,
    area: 61.32,
    bedrooms: 2,
    rooms: "3 комнаты",
    livingArea: "45,4 м²",
    terrace: "15,92 м²",
    ceiling: "2,7 м",
    gallery: [bear77_1, bear77_2, bear77Plan3d, bear77Plan],
  },
  {
    slug: "bear-house-86",
    name: "BEAR HOUSE 86 м²",
    collection: "BEAR",
    description: "Семейный дом с двумя спальнями и двумя санузлами.",
    story: "Две изолированные спальни, отдельные кухня и гостиная, два санузла и крытая терраса рассчитаны на комфортные семейные будни.",
    price: 4_349_000,
    area: 68.7,
    bedrooms: 2,
    rooms: "3 комнаты",
    livingArea: "59,5 м²",
    terrace: "9,24 м²",
    ceiling: "2,7 м",
    gallery: [bear86_1, bear86_2, bear86Plan3d, bear86Plan],
  },
  {
    slug: "bear-house-134",
    name: "BEAR HOUSE 134 м²",
    collection: "BEAR",
    description: "Семейный дом с мастер-спальней и двумя террасами.",
    story: "Панорамные окна, светлая кухня-гостиная, две спальни и две террасы дают семье общие пространства и возможность уединиться.",
    price: 8_762_000,
    area: 110,
    bedrooms: 2,
    rooms: "3 комнаты",
    livingArea: "86,4 м²",
    terrace: "13,5 м² и 8 м²",
    ceiling: "2,8 м",
    gallery: [bear134_1, bear134_2, bear134Plan3d, bear134Plan],
  },
  {
    slug: "vast-house",
    name: "VAST HOUSE 140 м²",
    collection: "VAST",
    description: "Просторный семейный дом с большой гостиной.",
    story: "Пять спален, два санузла и большая кухня-гостиная образуют дом для большой семьи. Проект допускает дальнейшее расширение дополнительными модулями.",
    price: 8_077_600,
    area: 114.9,
    bedrooms: 5,
    rooms: "6 комнат",
    livingArea: "114,9 м²",
    terrace: "13,63 м² мастер-спальня",
    ceiling: "2,7 м",
    gallery: [vast1, vast2, vastPlan3d, vastPlan],
  },
  {
    slug: "bear-house-168",
    name: "BEAR HOUSE 168 м²",
    collection: "BEAR",
    description: "Максимальный простор для большой семьи.",
    story: "Три изолированные спальни, кухня-гостиная с камином, три санузла, гардеробная и кладовая распределены по функциональным зонам.",
    price: 12_110_400,
    area: 146.4,
    bedrooms: 3,
    rooms: "4 комнаты",
    livingArea: "113,4 м²",
    terrace: "11,1 м² и 10,56 м²",
    ceiling: "2,8 м",
    gallery: [bear168_1, bear168_2, bear168Plan3d, bear168Plan],
  },
];

export const platformaProcess = [
  ["Заявка и консультация", "Уточняем задачи и сценарии жизни."],
  ["Проект под сценарии жизни", "Согласовываем планировку и комплектацию."],
  ["Заводская сборка", "Производим модули и контролируем качество."],
  ["Доставка и монтаж", "Доставляем дом и собираем его на участке."],
  ["Заезд", "Передаём полностью готовый к жизни дом."],
];

export const platformaReasons = [
  ["Индивидуальные проекты", "Архитектура, планировка и детали адаптируются под клиента."],
  ["Скорость строительства", "Производство в тёплом цехе и монтаж на участке в любой сезон."],
  ["Качественные материалы", "Контроль материалов и узлов от каркаса до отделки."],
  ["Точная стоимость", "Бюджет фиксируется в договоре до начала производства."],
  ["Беспроцентная рассрочка", "Покупка напрямую у производителя без банковской переплаты."],
  ["Подбор участков и документы", "Помощь с участком, фундаментом и юридическими вопросами."],
  ["Расширенная гарантия качества", "10 лет на силовой каркас и 1 год на отделку."],
  ["Забота о клиентах", "Сопровождение продолжается после установки дома."],
];

export const platformaSpecifications = [
  ["Конструктив", "Доска камерной сушки с антисептической и огнебиозащитной обработкой"],
  ["Тепло- и шумоизоляция", "KNAUF Aquastatik: стены 150 мм, кровля 200 мм"],
  ["Гидроветрозащита", "DELTA®-TPU PLUS"],
  ["Пароизоляция", "DELTA®-DAWI 200"],
  ["Внешняя отделка", "Планкен из хвойных пород с защитным покрытием"],
  ["Внутренняя отделка", "Имитация бруса"],
  ["Отопление", "Электроконвекторы"],
  ["Остекление", "ПВХ, двухкамерные стеклопакеты и пятикамерный профиль"],
  ["Вентиляция", "Приточный клапан ARIUS и вытяжка в санузле"],
  ["Монтаж", "Установка модулей, стыковка, инженерные подключения и герметизация"],
];

export const platformaOptions = [
  "Система «Умный дом»",
  "Охранная сигнализация",
  "Кондиционирование",
  "Wi-Fi управление отоплением",
  "Удалённое управление водонагревателем",
  "Автоматическое управление вентиляцией",
  "Видеонаблюдение",
  "Система защиты от протечек",
  "Водяные тёплые полы",
];

export const platformaWorkStages = [
  ["Заявка", "Менеджер уточняет требования к будущему дому."],
  ["Согласование комплектации", "Выбираются материалы, планировка и дополнительные опции."],
  ["Предложение", "Готовится расчёт с подробным составом работ."],
  ["Посещение строительной площадки", "Специалисты осматривают участок и условия монтажа."],
  ["Договор", "Фиксируются стоимость, комплектация и сроки."],
  ["Производство", "Модули собираются в тёплом цехе с контролем качества."],
  ["Доставка и монтаж", "Дом доставляется на участок и собирается на фундаменте."],
  ["Ввод в эксплуатацию", "Клиент получает готовый дом и руководство по эксплуатации."],
];

export const platformaReviews = [
  ["Полина", "Дом сдан", "Выбрали компанию из-за фиксированной цены и понятного общения. Посетили производство и увидели процесс своими глазами."],
  ["Наталья", "Дом на этапе производства", "Команда адаптировала проект под пожелания, показала производство и помогла разобраться с ипотекой."],
  ["Михаил", "Дом на этапе производства", "После экскурсии на производство стало понятно, как собираются дома и как контролируется качество."],
  ["Карина", "Баня сдана", "Модульную баню аккуратно доставили и установили. Парная быстро нагревается и хорошо держит тепло."],
];

export const platformaFaqGroups = [
  {
    title: "Круглогодичное проживание",
    items: [
      ["Подходит ли модульный дом для постоянного проживания?", "Да. Конструкция, утепление и инженерные системы рассчитаны на эксплуатацию 365 дней в году."],
      ["Можно ли комфортно жить зимой?", "Да. Используются утеплитель KNAUF Aquastatik, герметичный контур и заводской контроль всех слоёв."],
      ["Как решается вопрос отопления?", "В базе предусмотрены электроконвекторы. При необходимости подбирается другая система отопления."],
      ["Что происходит при перепадах температуры?", "Сухой каркас и мембраны рассчитаны на сезонные и суточные изменения температуры."],
    ],
  },
  {
    title: "Технология и конструкция",
    items: [
      ["Как строится модульный дом?", "Отдельные модули производятся в цехе, затем доставляются на участок и соединяются в готовое здание."],
      ["Чем модульный дом отличается от каркасного?", "Основной объём работ выполняется на заводе, поэтому погода меньше влияет на срок и качество сборки."],
      ["Какие материалы используются?", "Сухая строганая доска, KNAUF Aquastatik, мембраны DELTA, планкен, профлист и ПВХ-остекление."],
      ["Какой срок службы дома?", "При соблюдении условий эксплуатации официальный ориентир производителя составляет от 50 лет."],
    ],
  },
  {
    title: "Фундамент и участок",
    items: [
      ["Что делать, если участка ещё нет?", "Компания помогает подобрать участок под проект, подъезд техники, фундамент и коммуникации."],
      ["Какой фундамент подходит?", "Используются блочные, свайно-винтовые и свайно-забивные решения. Выбор зависит от участка."],
      ["Сколько занимает монтаж?", "Монтаж модулей на готовом фундаменте обычно занимает 1-3 дня."],
      ["Можно ли строить на сложном участке?", "Да. После геологии подбирается фундамент с учётом грунта, воды и перепада высот."],
    ],
  },
  {
    title: "Стоимость и договор",
    items: [
      ["Что входит в стоимость под ключ?", "Производство, стандартная отделка, утепление, кровля, окна, двери, базовая инженерия и монтаж."],
      ["Фиксируется ли цена?", "Да. Стоимость согласовывается до производства и закрепляется в договоре."],
      ["Как проходит оплата?", "Оплата делится на этапы: договор, производство, доставка и монтаж."],
      ["Есть ли гарантия?", "10 лет на силовой каркас и 1 год на отделку."],
    ],
  },
  {
    title: "Комплектация и инженерия",
    items: [
      ["Что входит в стандартную комплектацию?", "Чистовая отделка, утеплённый контур, окна и двери, электрика, отопление, вентиляция и точки подключения."],
      ["Какие коммуникации нужны на участке?", "Электричество, источник воды и система водоотведения."],
      ["Можно ли дооснастить дом позже?", "Да. Можно расширить электрику, инженерные системы, автоматизацию и оборудование."],
      ["Подходит ли дом для автономного проживания?", "Да. Возможны собственная скважина, септик и резервное электропитание."],
    ],
  },
];
