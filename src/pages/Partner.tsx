import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShieldCheck, Star, ArrowUpDown, MapPin, Menu, Home, Heart, MessageCircle, LayoutGrid, X, RotateCcw, Package, Info, Globe, Mail, Phone, Instagram, Facebook, Send, ArrowUpRight, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import shareIcon from "@/assets/share-icon.svg";
import chebwoodBackdrop from "@/assets/chebwood/glamping/01.webp";
import dommBackdrop from "@/assets/domm/modul-house-1/01.webp";
import panoramicBackdrop from "@/assets/panoramic-home/backdrop.webp";
import pslBarn40Backdrop from "@/assets/pslcomp/barn-40/02.webp";
import ultradomBackdrop from "@/assets/ultradomspb/ultra-65/01.webp";
import stroygradBackdrop from "@/assets/stroygrad/quattro-barn/01.webp";
import modulcampBackdrop from "@/assets/modulcamp/barn-house/01.webp";
import elmacoBackdrop from "@/assets/elmaco/ivor/01.webp";
import novatorBackdrop from "@/assets/novator/radius/01.webp";
import blagohouseBackdrop from "@/assets/blagohouse/blagobarn-29/01.webp";
import stilnyeModuliBackdrop from "@/assets/stilnye-moduli/quad/01.webp";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import NotFound from "@/pages/NotFound";
import { navigateWithTransition } from "@/lib/viewTransition";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  projects as allProjects,
  projectsCountByMakerId,
  makersById,
} from "@/data/projects";
import { getPartnerReviews, getPartnerReviewSummary } from "@/data/partnerReviews";

const wordForm = (n: number, forms: [string, string, string]) => {
  const m = Math.abs(n) % 100;
  const m1 = m % 10;
  if (m > 10 && m < 20) return forms[2];
  if (m1 > 1 && m1 < 5) return forms[1];
  if (m1 === 1) return forms[0];
  return forms[2];
};

// Маппинг id из URL → makerId. Поддерживаем легаси "1" → platforma.
const partnerMakerIds: Record<string, string> = { "1": "platforma" };

const hitBackdropByMakerId: Record<string, string> = {
  chebwood: chebwoodBackdrop,
  domm: dommBackdrop,
  "panoramic-home": panoramicBackdrop,
  pslcomp: pslBarn40Backdrop,
  ultradomspb: ultradomBackdrop,
  stroygrad: stroygradBackdrop,
  modulcamp: modulcampBackdrop,
  elmaco: elmacoBackdrop,
  novator: novatorBackdrop,
  blagohouse: blagohouseBackdrop,
  "stilnye-moduli": stilnyeModuliBackdrop,
};

// Тексты «о компании» — единственное, что не выводится автоматически из projects.ts.
const aboutByMakerId: Record<string, string> = {
  platforma:
    "Производитель модульных домов из Екатеринбурга. Проектируем и собираем компактные одноэтажные дома для круглогодичного проживания и загородного отдыха.",
  bygge:
    "Bygge — производитель модульных домов из Екатеринбурга. Дома полной заводской готовности под ключ: с тёплыми полами, оборудованным санузлом и вытяжной вентиляцией.",
  "durov-house":
    "DUROV.HOUSE — производитель модульных домов из Воронежа. Компания выпускает одноэтажные дома серий Barn и Flat для дачи, аренды, глэмпинга и круглогодичного проживания с доставкой по России.",
  histhut:
    "HISTHUT — производитель модульных домов из Пермского края. Компания выпускает компактные модульные дома серии «Хижина» для дачи, глэмпинга, аренды и круглогодичного отдыха с доставкой по России.",
  countryhouse:
    "CountryHouse — производитель модульных домов и бань из Санкт-Петербурга. Компания строит модульные дома под ключ по всей России: от компактных одномодульных решений до просторных пятимодульных домов для загородного проживания.",
  "cuba-dom":
    "CUBA DOM — производитель модульных домов из Санкт-Петербурга. В каталоге компании представлены современные модульные дома площадью от 35 до 90 м² с разными планировками, террасами и комплектациями от тёплого контура до чистовой отделки.",
  idolhouse:
    "АЙДОЛХАУС — производитель модульных и каркасных домов из Воронежа. Компания выпускает дома для круглогодичного проживания с заводской подготовкой, продуманными планировками, террасами и доставкой по России.",
  woodalp:
    "WOODALP — производитель модульно-каркасных домов из Московской области. Компания работает в формате prefab, предлагает современные дома серии WOODHOUSE для загородного проживания и адаптирует решения под участок клиента.",
  boxmate:
    "Boxmate — бренд модульных домов из Санкт-Петербурга. В каталоге представлены дома серий Flat и Red с современными планировками, террасами и комплектациями для круглогодичного загородного проживания.",
  uvhouse:
    "UV House — производитель модульных домов и бань из Уфы. Компания делает компактные модульные дома для дачи, проживания и отдыха: от небольших одноэтажных модулей до проектов с террасами и несколькими спальнями.",
  "asterius-house":
    "Asterius House — производитель каркасно-модульных домов с собственным производством в Чебоксарах и работой по Московской области. Компания выпускает дома заводской готовности для дачи, глэмпинга, аренды и круглогодичного проживания с доставкой и монтажом на участке.",
  "smola-house":
    "SMOLA HOUSE — производитель модульных домов в Московской области. Компания предлагает современные одноэтажные дома с террасами, панорамным остеклением и планировками для дачи, глэмпинга и постоянного проживания.",
  ultradomspb:
    "UltraDomSPb — строительная компания из Санкт-Петербурга, которая делает одноэтажные модульные дома под ключ. В каталоге представлены дома с двускатной и плоской кровлей, готовой отделкой, инженерией и реальными примерами построек.",
  "freedom-naturi":
    "FREEDOM NATURI — производитель автономных модульных домов из Московской области. Компания делает готовые дома для жизни, отдыха, глэмпинга и мобильных сценариев без капитальной стройки.",
  chebwood:
    "Чебвуд — производитель модульных домов и бань из Чебоксар. Компания выпускает готовые модули для дачи, проживания, глэмпинга и бизнеса с доставкой, монтажом на участке и быстрым циклом производства.",
  campingdom:
    "Campingdom — производитель модульных домов из Татарстана. Компания делает компактные дома для жизни, отдыха и бизнеса: от небольших модулей до barn-проектов с санузлом, террасами и готовой отделкой.",
  pslcomp:
    "Промстройлес — производитель деревянных и модульных CLT-домов из Санкт-Петербурга. В каталоге представлены жилые модульные дома Барн и Хайтек с фиксированными ценами, планировками и строительством под ключ.",
  glezman:
    "Glezman Group — производитель каркасных домов из Перми. Линейка La Rus: компактные и просторные дома площадью от 45 до 127 м² с панорамным остеклением и продуманной планировкой.",
  divodom:
    "ДивоДом — производитель модульных домов из Перми. Линейка ДИВО: дома полной заводской готовности площадью от 30 до 110 м² с террасами, утеплением до −30°C и монтажом за 1 день.",
  gradodom:
    "ГрадоДом — производитель каркасных домов из Пермского края. Каркасные одно- и двухэтажные дома площадью от 55 м² с продуманной планировкой и сроком строительства от 3 месяцев.",
  zagorodom:
    "СК «Загородом» — строительная компания из Пермского края. Каркасные дома и барнхаусы под ключ с террасами, панорамным остеклением и современной архитектурой.",
  apa:
    "Апа Групп — производитель каркасных домов из Пермского края. Линейка АА: одно- и двухэтажные дома площадью от 68 до 106 м² со сроком строительства от 3 месяцев.",
  "prime-modul":
    "Прайм Модуль — производитель каркасных домов из Пермского края. Дома и барнхаусы площадью от 42 до 200 м² на винтовом фундаменте с утеплением базальтовой ватой, водяным тёплым полом и сроком строительства от 1 месяца.",
  utkino:
    "СК Уткино — строительная компания из Пермского края. В каталоге представлены каркасные дома в комплектации тёплый контур площадью от 32,6 до 72,11 м²: компактные дачные проекты, одноэтажные дома для семьи и дом с мансардой.",
  teplodina:
    "Теплодина — строительная компания из Екатеринбурга. В каталоге представлены каркасные дома под ключ площадью от 48 до 85,8 м²: компактные дачные проекты и одноэтажные дома для постоянного проживания.",
  "karkas-haus":
    "Karkas.haus — строительная компания из Екатеринбурга. В каталоге представлены каркасные дома камерной сушки площадью от 93,1 до 140,6 м²: одноэтажные проекты и барнхаус с террасами, крыльцами и комплектацией тёплый контур.",
  "ural-house":
    "Урал Хаус — строительная компания из Екатеринбурга. В каталоге представлены энергоэффективные каркасные дома в скандинавском, классическом стиле, барнхаус и фахверк площадью от 48 до 146 м².",
  "hochu-dom":
    "Хочу Дом — строительная компания из Москвы и Московской области. В каталоге представлены каркасные дома площадью от 91 до 130 м² с комплектациями от каркаса под крышу до дома для постоянного проживания.",
  "berest-dom":
    "Берест — строительная компания из Москвы и Московской области. В каталоге представлены каркасные дома под ключ площадью от 100,15 до 174,5 м²: проекты с мансардой, полутораэтажные коттеджи и дома для постоянного проживания.",
  rift:
    "РИФТ — строительная компания из Москвы и Московской области. В каталоге представлены каркасные дома площадью от 79 до 158 м²: одноэтажные и двухэтажные проекты с террасами, панорамным остеклением и комплектациями с отделкой.",
  izbrusa:
    "Из Бруса — строительная компания из Москвы и Московской области. В каталоге представлены каркасные дома площадью от 62,4 до 127,5 м²: одноэтажные проекты, дом с мансардой и решения с террасами.",
  scandiecodom:
    "Сканди ЭкоДом — строительная компания из Санкт-Петербурга и Ленинградской области. В каталоге представлены зимние каркасные дома под ключ площадью от 130,2 до 276,7 м²: одноэтажные проекты, барнхаусы, дома с сауной, СПА-зоной и панорамным остеклением.",
  "karkas-povolzhya":
    "Каркас Поволжья — строительная компания из Казани и Республики Татарстан. В каталоге представлены каркасные дома площадью от 62 до 120 м²: одно- и двухэтажные проекты с террасами, верандами, панорамным остеклением и возможностью адаптации планировки.",
  kazanstroy16:
    "Строй Дом — строительная компания из Казани. В каталоге представлены каркасные дома площадью от 62,02 до 68,2 м²: компактные одно- и двухэтажные проекты с мансардой, террасой, эркером и готовыми планировками.",
  askhome:
    "AskHome — строительная и архитектурная компания из Казани. В каталоге представлены современные каркасные дома площадью от 80 до 130 м²: проекты Nova, Modera и Astra с панорамным остеклением, продуманными планировками и комплектацией под ключ.",
  domoteka:
    "Домотека — строительная компания из Краснодара. В каталоге представлены каркасные дома, барнхаусы и глэмпинг-проекты площадью от 42 до 229 м² с комплектациями под ключ и возможностью онлайн-показа.",
  "karkas-dom-yug":
    "Каркасный Дом Юг — строительная компания из Краснодарского края. В каталоге представлены каркасные дома линейки Шале площадью от 65 до 90 м² с семейной ипотекой, теплым контуром и сроком строительства от 31 дня.",
  sibiryak:
    "Сибиряк — строительная компания из Краснодарского края. В каталоге представлены каркасные барн-дома площадью от 28 до 120 м² для загородного отдыха, глэмпинга и постоянного проживания.",
  "svoi-house":
    "СК «Свой» — строительная компания из Санкт-Петербурга и Ленинградской области. В каталоге представлены каркасные дома и линейка СВОЙ ЛАЙТ площадью от 41 до 123 м² с современными фасадами, террасами и панорамным остеклением.",
  bagrovstroy:
    "Багров Строй — строительная компания из Санкт-Петербурга и Ленинградской области. В каталоге представлены классические каркасные дома площадью от 82 до 141 м²: одноэтажные и двухэтажные проекты с готовыми планировками.",
  domakarkas:
    "Строй Комфорт — строительство каркасных домов в Санкт-Петербурге. В подборке представлены одноэтажные дома площадью от 108 до 130 м² с террасами, сауной, вторым светом и панорамным остеклением.",
  "sk-garmoniya":
    "СК Гармония — строительная компания из Санкт-Петербурга и Ленинградской области. В каталоге представлены каркасные дома под ключ площадью от 54 до 152 м²: компактные, семейные и просторные проекты для постоянного проживания.",
  "praktika-stroy":
    "Практика Строй — производитель модульных домов из Санкт-Петербурга и Ленинградской области. В каталоге представлены серии Практик 2.0 и 3.0: компактные дома от 40,9 до 66,4 м² с террасами, отделкой, инженерными системами и готовностью к круглогодичному проживанию.",
  "eco-city":
    "Eco-City — компания из Санкт-Петербурга, работающая с домами из СИП-панелей. В подборке представлены компактные и семейные СИП-префаб проекты площадью от 37,5 до 95 м²: одноэтажные и двухэтажные решения для дачи и постоянного проживания.",
  modom:
    "Modom — производитель модульных домов из Санкт-Петербурга и Ленинградской области. В каталоге представлены готовые модульные решения UNO и серия О2 площадью от 25,4 до 50,8 м² с санузлом, инженерными системами и террасой.",
  housebox:
    "HouseBox — производитель компактных модульных домов из Санкт-Петербурга и Ленинградской области. В подборке представлены небольшие гостевые и дачные модули площадью 14–19 м² с вариантами мебели и санузла.",
  glavles:
    "Главлес — производитель модульных деревянных домов из Екатеринбурга. В каталоге представлены компактные и семейные проекты площадью от 25 до 87 м² с сезонными и круглогодичными комплектациями.",
  "fps-modul":
    "ФПС Модуль — производитель модульных домов из Екатеринбурга. В подборке представлены линейки АртХаус, Барн Викинг и Барн Стандарт: дома площадью от 30 до 54 м² с готовыми планировками и базовой отделкой.",
  "vek-trad":
    "Вековые Традиции — строительная компания из Екатеринбурга. В каталоге представлены модульные дома площадью от 60 до 98 м² с террасами, комплектациями тепловой контур и под ключ.",
  "budushiy-dom":
    "Будущий Дом — строительная компания из Екатеринбурга. В подборке представлены модульные дома в стилях хай-тек, барнхаус и современные одноэтажные проекты площадью от 32,5 до 75 м².",
  "doma-ot-mihalycha":
    "Дома от Михалыча — строительная компания из Нижнего Новгорода и Нижегородской области. В каталоге представлены каркасные дома площадью от 55 до 158 м²: компактные проекты, одноэтажные семейные дома и просторные варианты с готовыми планировками.",
  barnstudio:
    "Barn Studio — строительная компания, которая строит каркасные дома в стиле барнхаус по технологии Prefab в Нижегородской и Московской области. В каталоге представлены дома площадью от 84 до 220 м² с панорамным остеклением, планировками для круглогодичного проживания и утеплением до −40°C.",
  "beli-dom":
    "СК «Белый дом» — строительная компания из Нижнего Новгорода. В каталоге представлены каркасные загородные дома площадью от 72,75 до 126 м²: одно- и двухэтажные проекты с террасами, балконами, готовыми планировками и строительством под ключ.",
  "mastergrupp-barnaul":
    "МастерГруппБарнаул — строительная компания из Барнаула, работающая в городе и Алтайском крае. В каталоге представлены каркасные дома площадью от 62,02 до 68,2 м²: одноэтажные семейные проекты и компактные дома с мансардой, террасой или эркером.",
  "azbuka-doma":
    "Азбука Дома — строительная компания из Краснодарского края. В подборке представлены одноэтажные каркасные дома серии «Заря» площадью от 57,6 до 104,5 м² с готовыми семейными планировками.",
  "yuzhny-dom":
    "Южный Дом — строительная компания из Краснодарского края. В каталоге представлены каркасные дома площадью от 25 до 140 м²: компактные дачные проекты и просторные семейные дома с террасами.",
  "klyuch-st":
    "Ключ СТ — строительная компания, представленная в Казани. В каталоге собраны одноэтажные каркасные дома площадью от 35 до 96 м² для дачного и круглогодичного проживания.",
  "doorhan-kazan":
    "DoorHan — производитель быстровозводимых домокомплектов, представленный в Казани. В подборке представлены одно- и двухэтажные дома площадью от 29 до 88 м² заводской готовности.",
  avgst:
    "Авангард Строй — производитель модульных домов из Нижнего Новгорода. В каталоге представлены современные барнхаусы и дома заводского производства площадью от 68,8 до 133,65 м².",
  "stroylider-nn":
    "Строй Лидер — строительная компания из Нижнего Новгорода. В подборке представлены одно- и двухэтажные каркасные дома серии «Карелия» площадью от 60,74 до 148,2 м².",
  "postroidom-altai":
    "ПостройДом — строительная компания, работающая в Алтайском крае. В каталоге представлены современные каркасные дома Forest и A-frame площадью от 50 до 253 м².",
  "altai-mda":
    "Алтай МодульДом — производитель модульных домов из Алтайского края. В подборке представлены компактные и семейные дома заводской готовности площадью от 15 до 71,2 м².",
  domnasm:
    "Домнас Модуль — производитель модульных домов из Казани. В каталоге представлены дома заводской готовности с отделкой, мебелью и коммуникациями: компактные модули, семейные проекты и barn-формат.",
  blackmodule:
    "BlackModule — производитель модульных домов из Санкт-Петербурга и Ленинградской области. Компания делает современные дома заводской готовности с тёмными фасадами, террасами и форматами от одного до четырёх модулей.",
  domm:
    "DOMM — производитель модульных домов из Новосибирска. В подборке представлены компактные и семейные дома площадью от 27 до 60 м² для дачи, отдыха и круглогодичного проживания.",
  "my-module":
    "Мой Модуль — производитель модульных домов из Москвы и Московской области. В каталоге собраны проекты Барни, Корнер, Скандинавия и Z для дачного и круглогодичного загородного сценария.",
  "4modul":
    "4 Стихии — производитель модульных домов. В подборке представлены жилые проекты Карелия и Барн площадью от 30 до 76 м² с заводской сборкой, современными фасадами и планировками для дачи или круглогодичного проживания.",
  cubber:
    "Cubber Prefab — производитель модульных домов из Новокузнецка. В подборке представлены проекты HOUSE площадью от 47 до 94 м² для дачи, постоянного проживания, аренды и туристических сценариев.",
  simplehouse:
    "Simple House — производитель модульных домов из Санкт-Петербурга. Основной продукт компании — модульный дом Simple с продуманной компактной планировкой, экологичными материалами и быстрым монтажом на участке.",
  "panoramic-home":
    "Panoramic Home — производитель модульных домов из Красноярска. В каталоге представлены готовые дома XL, BIG и MIDDLE с панорамным остеклением, заводской сборкой и комплектацией под ключ.",
  ambarn:
    "АмбарН — производитель модульных домов из Краснодарского края. В подборке представлены проекты Мини Барн и Индиго с террасами, быстрым сроком строительства и комплектацией под ключ.",
  myfamilyhouse:
    "FAMILY HOUSE — производитель каркасно-модульных домов. Компания строит дома под ключ с заводским изготовлением модулей, адаптацией планировки и доставкой по ЮФО и СКФО.",
  stroygrad:
    "СтройГрад — производитель модульных домов и загородных строений из Московской области. В подборке представлены компактные mini-дома и семейные модульные проекты в современной и барн-архитектуре.",
  modulcamp:
    "Modul Camp — производитель модульных домов для Московской области и загородных участков. В каталоге представлены одноэтажные дома Барн-Хаус, Голландия, Шале, Финляндия и Дания с готовыми планировочными решениями.",
  elmaco:
    "Elmaco Homes — производитель модульных домов с представительствами в Санкт-Петербурге, Москве и Краснодаре. В подборке представлены серии Ivor, Lukas, Jung, Tor и Oscar: от компактных домов до просторных семейных решений.",
  novator:
    "Novator — производитель модульных домов из Санкт-Петербурга. Компания выпускает компактные модули серий N и Radius для глэмпинга, отдыха, аренды и круглогодичного загородного сценария.",
  blagohouse:
    "BlagoHouse — производитель готовых модульных домов и барнхаусов в Москве и Московской области. В каталоге представлены BlagoBarn площадью от компактных гостевых домов до больших семейных проектов.",
  "stilnye-moduli":
    "Стильные Модули — производитель модульных домов, офисов и бань под ключ в Московской области. В подборке представлены типовые решения Куб, Овал, Трапеция и Барн для дачи, проживания и глэмпинга.",
};

const manualCounts: Record<string, number> = { bygge: 5 };

/** Палитра страницы партнёра. Подбирается под визуал проектов производителя:
 *  светлые, «белые» проекты — светлая страница, тёмные — тёмная. */
type PartnerTheme = { page: string; panel: string; ink: string; light: boolean };
const DARK_THEME: PartnerTheme = { page: "25 14% 16%", panel: "28 12% 24%", ink: "0 0% 100%", light: false };
const partnerThemes: Record<string, PartnerTheme> = {
  platforma: DARK_THEME,
  bygge: { page: "24 10% 15%", panel: "26 9% 23%", ink: "0 0% 100%", light: false },
  "durov-house": { page: "0 0% 12%", panel: "0 0% 19%", ink: "0 0% 100%", light: false },
  histhut: { page: "22 20% 14%", panel: "24 16% 22%", ink: "0 0% 100%", light: false },
  countryhouse: { page: "140 12% 14%", panel: "140 10% 22%", ink: "0 0% 100%", light: false },
  "cuba-dom": { page: "35 24% 92%", panel: "35 22% 96%", ink: "25 15% 12%", light: true },
  idolhouse: { page: "30 12% 93%", panel: "0 0% 100%", ink: "0 0% 10%", light: true },
  woodalp: { page: "30 16% 15%", panel: "30 13% 23%", ink: "0 0% 100%", light: false },
  boxmate: { page: "215 12% 14%", panel: "215 10% 22%", ink: "0 0% 100%", light: false },
  uvhouse: { page: "210 18% 94%", panel: "0 0% 100%", ink: "215 25% 12%", light: true },
  "asterius-house": { page: "215 14% 16%", panel: "215 12% 24%", ink: "0 0% 100%", light: false },
  // Палитры ниже подобраны по среднему тону фотографий проектов производителя.
  "smola-house": { page: "40 12% 93%", panel: "0 0% 100%", ink: "30 12% 12%", light: true },
  ultradomspb: { page: "90 8% 92%", panel: "0 0% 100%", ink: "90 10% 12%", light: true },
  "freedom-naturi": { page: "50 22% 13%", panel: "50 16% 21%", ink: "0 0% 100%", light: false },
  chebwood: { page: "40 20% 15%", panel: "40 16% 23%", ink: "0 0% 100%", light: false },
  campingdom: { page: "52 16% 14%", panel: "52 12% 22%", ink: "0 0% 100%", light: false },
  pslcomp: { page: "100 6% 16%", panel: "100 5% 24%", ink: "0 0% 100%", light: false },
  domnasm: { page: "36 22% 92%", panel: "36 18% 96%", ink: "28 15% 12%", light: true },
  blackmodule: { page: "0 0% 10%", panel: "0 0% 18%", ink: "0 0% 100%", light: false },
  domm: { page: "42 24% 13%", panel: "42 18% 21%", ink: "0 0% 100%", light: false },
  "my-module": { page: "216 16% 94%", panel: "0 0% 100%", ink: "218 20% 14%", light: true },
  "4modul": { page: "90 10% 14%", panel: "90 8% 22%", ink: "0 0% 100%", light: false },
  cubber: { page: "94 14% 16%", panel: "94 11% 24%", ink: "0 0% 100%", light: false },
  simplehouse: { page: "34 18% 14%", panel: "34 14% 22%", ink: "0 0% 100%", light: false },
  "panoramic-home": { page: "210 14% 92%", panel: "0 0% 100%", ink: "215 18% 13%", light: true },
  ambarn: { page: "84 18% 92%", panel: "0 0% 100%", ink: "80 16% 12%", light: true },
  myfamilyhouse: { page: "38 18% 91%", panel: "0 0% 100%", ink: "30 16% 12%", light: true },
  stroygrad: { page: "96 12% 15%", panel: "96 10% 23%", ink: "0 0% 100%", light: false },
  modulcamp: { page: "42 18% 91%", panel: "0 0% 100%", ink: "34 16% 12%", light: true },
  elmaco: { page: "34 12% 93%", panel: "0 0% 100%", ink: "30 12% 12%", light: true },
  novator: { page: "220 14% 13%", panel: "220 12% 21%", ink: "0 0% 100%", light: false },
  blagohouse: { page: "92 14% 15%", panel: "92 12% 23%", ink: "0 0% 100%", light: false },
  "stilnye-moduli": { page: "120 9% 14%", panel: "120 8% 22%", ink: "0 0% 100%", light: false },
};

const Partner = () => {
  const navigate = useNavigate();
  const handleProjectClick = (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => {
    navigateWithTransition(e, navigate, `/project/${projectId}`);
  };
  const location = useLocation();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const sortOptions = [
    { value: "rating", label: "С высоким рейтингом" },
    { value: "popular", label: "Популярные" },
    { value: "new", label: "Новинки" },
    { value: "cheap", label: "Дешевле" },
    { value: "expensive", label: "Дороже" },
    { value: "area_asc", label: "По площади м², от меньшего" },
    { value: "area_desc", label: "По площади м², от большего" },
    { value: "fast", label: "Быстрый монтаж" },
  ];

  const priceNum = (s: string) => parseInt(String(s).replace(/\D/g, ""), 10) || 0;
  const areaNum = (s: string) => parseFloat(String(s).replace(/[^\d.]/g, "")) || 0;
  const termNum = (s: string) => parseInt(String(s).replace(/\D/g, ""), 10) || 0;

  const requestedMakerId = id ? partnerMakerIds[id] ?? (makersById[id] ? id : undefined) : "platforma";
  const isUnknownPartner = !requestedMakerId;
  const makerId = requestedMakerId ?? "platforma";
  const summary = makersById[makerId];
  const projectsCount = manualCounts[makerId] ?? projectsCountByMakerId[makerId] ?? 0;

  // Проекты этой компании — берём из единого источника правды.
  const makerProjects = useMemo(
    () => allProjects.filter((p) => p.maker.id === makerId),
    [makerId]
  );
  const heroImage = makerProjects[0]?.gallery[0]?.image ?? "";

  // Соберём уникальные технологии/материалы — для секции "По технологии".
  const techGroups = useMemo(() => {
    const map = new Map<string, { tech: string; image: string; count: number }>();
    makerProjects.forEach((p) => {
      const t = p.technology || "—";
      const existing = map.get(t);
      if (existing) existing.count += 1;
      else map.set(t, { tech: t, image: p.gallery[0]?.image ?? "", count: 1 });
    });
    return Array.from(map.values());
  }, [makerProjects]);

  const sortedMakerProjects = useMemo(() => {
    const arr = [...makerProjects];
    arr.sort((a: any, b: any) => {
      switch (sortBy) {
        case "cheap": return priceNum(a.price) - priceNum(b.price);
        case "expensive": return priceNum(b.price) - priceNum(a.price);
        case "area_asc": return areaNum(a.area) - areaNum(b.area);
        case "area_desc": return areaNum(b.area) - areaNum(a.area);
        case "fast": return termNum(a.term) - termNum(b.term);
        case "popular": return (b.likes ?? 0) - (a.likes ?? 0);
        case "new": return (b.id ?? 0) - (a.id ?? 0);
        case "rating": return (b.rating ?? 0) - (a.rating ?? 0);
        default: return 0;
      }
    });
    return arr;
  }, [makerProjects, sortBy]);

  const partner = {
    name: summary?.name ?? "Партнёр",
    initials: summary?.initials ?? "—",
    logo: summary?.logo,
    city: summary?.city ?? "",
    category: (summary?.technology === "Модульный дом" ? "Модульные дома" : summary?.technology) ?? "Производитель домов",
    about: aboutByMakerId[makerId] ?? `${summary?.name ?? "Партнёр"} — производитель домов.`,
    siteUrl: summary?.siteUrl ?? "#",
    productionAddress: summary?.productionAddress,
    phone: summary?.phone,
    email: summary?.email,
    telegram: summary?.telegram,
  };

  const cleanSiteUrl = partner.siteUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const violationMailto = `mailto:inadvert@yandex.ru?subject=${encodeURIComponent("Сообщение о нарушении прав")}&body=${encodeURIComponent(`Карточка производителя: https://многоместа.рф/partner/${makerId}\nВаша компания: \nКомментарий: `)}`;

  const { rating, reviewsLabel, hasReviews } = getPartnerReviewSummary(makerId);
  const reviewPreviews = getPartnerReviews(makerId).slice(0, 4);



  const handleBack = () => {
    navigate("/");
  };

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: partner.name, url });
        return;
      }
    } catch (_) {
      // user cancelled or share unavailable — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if ((location.state as { openMenu?: boolean } | null)?.openMenu) {
      setMenuOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  if (isUnknownPartner) {
    return <NotFound />;
  }

  const isPlatforma = makerId === "platforma" || makerId === "bygge" || makerId === "durov-house" || makerId === "histhut" || makerId === "countryhouse" || makerId === "cuba-dom" || makerId === "idolhouse" || makerId === "woodalp" || makerId === "boxmate" || makerId === "uvhouse" || makerId === "asterius-house" || makerId === "smola-house" || makerId === "ultradomspb" || makerId === "freedom-naturi" || makerId === "chebwood" || makerId === "campingdom" || makerId === "pslcomp" || makerId === "domnasm" || makerId === "blackmodule" || makerId === "domm" || makerId === "my-module" || makerId === "4modul" || makerId === "cubber" || makerId === "simplehouse" || makerId === "panoramic-home" || makerId === "ambarn" || makerId === "myfamilyhouse" || makerId === "stroygrad" || makerId === "modulcamp" || makerId === "elmaco" || makerId === "novator" || makerId === "blagohouse" || makerId === "stilnye-moduli";
  const theme = partnerThemes[makerId ?? ""] ?? DARK_THEME;


  const HeroPlatforma = () => (
    <div className="relative overflow-hidden md:rounded-2xl min-h-[62vh] md:min-h-[500px] flex flex-col">
      {/* Резкое фото на весь hero, к низу маскируется (открывается фон страницы) */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
            loading="eager"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
            }}
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Плавный градиент к цвету фона страницы — для читаемости и бесшовного перехода */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent 35%, hsl(${theme.page} / 0.55) 65%, hsl(${theme.page}) 100%)` }}
      />





      {/* Top row: back + share + menu */}
      <div className="relative flex items-center justify-between px-3 md:px-8 pt-[max(env(safe-area-inset-top),12px)]">
        <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Назад">
          <ArrowLeft className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Поделиться">
            <img src={shareIcon} alt="" className="w-[18px] h-[18px]" style={{ filter: "brightness(0) invert(1)" }} loading="lazy" decoding="async" />
          </button>
          <button onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Меню">
            <Menu className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Текст на блюр-плашке (нижняя 1/3) */}
      <div className="relative mt-auto mb-[15%] h-1/3 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[hsl(var(--pt-ink))] leading-[1.05] tracking-tight font-bold uppercase text-[clamp(32px,9vw,52px)]">
          {partner.name}
        </h1>
        <button
          type="button"
          onClick={() => navigate(`/partner/${id}/reviews`, { state: { returnToMenu: true } })}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[hsl(var(--pt-ink))] px-3 py-1.5 rounded-xl bg-[hsl(var(--pt-ink)/0.14)] backdrop-blur-md active:bg-[hsl(var(--pt-ink)/0.24)] transition-colors"
          aria-label="Открыть отзывы"
        >
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <Star
            className={`w-3.5 h-3.5 ${hasReviews ? "fill-[hsl(var(--pt-ink))] text-[hsl(var(--pt-ink))]" : "text-[hsl(var(--pt-ink)/0.65)]"}`}
            strokeWidth={hasReviews ? 0 : 1.8}
          />
          <span className="text-[hsl(var(--pt-ink)/0.75)]">({reviewsLabel})</span>
        </button>
        <div className="mt-1.5 text-[12px] text-[hsl(var(--pt-ink)/0.7)] inline-flex items-center justify-center gap-1.5 w-full">
          <MapPin className="w-3 h-3" strokeWidth={1.8} />
          {partner.city}
          <span className="text-[hsl(var(--pt-ink)/0.4)]">·</span>
          {partner.category}
        </div>
      </div>
    </div>
  );

  const HeroDefault = () => (
    <div className="bg-background rounded-b-2xl md:rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 pt-[max(env(safe-area-inset-top),12px)] md:pt-6">
        <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
        </button>
        <button onClick={onShare} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center" aria-label="Поделиться">
          <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
        </button>
      </div>

      <div className="px-4 md:px-6 mt-4">
        <div className="bg-secondary rounded-xl px-3.5 md:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.8} />
            <span className="text-[13px] md:text-[14px] text-foreground/80 truncate">Это ваша компания?</span>
          </div>
          <Link to="/messages/support" className="text-[13px] md:text-[14px] font-medium text-primary inline-flex items-center gap-1 shrink-0">
            Подтвердить <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-5 md:pb-6 flex items-center gap-3 md:gap-4">
        <div className="w-[68px] h-[68px] md:w-[80px] md:h-[80px] rounded-2xl bg-secondary text-foreground/30 flex items-center justify-center text-base md:text-lg font-bold shrink-0 overflow-hidden">
          {partner.logo ? (
            <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          ) : (
            partner.initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[19px] md:text-[22px] font-bold text-foreground leading-tight mb-0.5 md:mb-1 truncate">{partner.name}</h1>
          <p className="text-[13px] md:text-[14px] text-muted-foreground truncate">{partner.category} · {partner.city}</p>
        </div>
      </div>

      <div className="border-t border-border grid grid-cols-3">
        {[{ val: String(projectsCount), label: wordForm(projectsCount, ["Проект", "Проекта", "Проектов"]) }, { val: "—", label: "Отзывы" }, { val: "—", label: "Рейтинг" }].map((s, i) => (
          <div key={s.label} className={`py-4 md:py-5 text-center ${i > 0 ? "border-l border-border" : ""}`}>
            <div className="text-[20px] md:text-[22px] font-bold text-foreground leading-none mb-1.5">{s.val}</div>
            <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 md:px-6 py-4 md:py-5">
        <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">О компании</p>
        <p className="text-[14px] md:text-[15px] text-foreground/85 leading-relaxed">{partner.about}</p>
        <div className="mt-8 pt-4 border-t border-border/40 space-y-4">
          {/* Видимая часть */}
          <p className="text-[11px] leading-[1.6] text-muted-foreground">
            Все права на проекты, изображения и название принадлежат компании{" "}
            <span className="font-semibold text-foreground">{partner.name}</span>
            {" ("}
            <a
              href={partner.siteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline break-all transition-colors"
            >
              {cleanSiteUrl}
            </a>
            {")."}
          </p>

          {/* Скрытая часть — аккордеон */}
          <Accordion type="single" collapsible defaultValue={undefined}>
            <AccordionItem value="rights" className="border-none">
              <AccordionTrigger className="text-[13px] font-semibold text-foreground/90 hover:text-foreground/70 hover:no-underline active:scale-[0.99] transition-transform duration-100 py-0 [&[data-state=open]>svg]:rotate-180 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:text-muted-foreground/70">
                Правообладателям
              </AccordionTrigger>
              <AccordionContent className="text-[11px] text-muted-foreground/80 leading-relaxed">
                Информация собрана из открытых источников и размещена для прямой связи покупателя с производителем. Если вы правообладатель и хотите удалить материал — сообщить о нарушении по почте{" "}
                <a
                  href={violationMailto}
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  inadvert@yandex.ru
                </a>
                {". Мы рассмотрим обращение в течение 24 часов."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );

  const Hero = isPlatforma ? HeroPlatforma : HeroDefault;
  const seoTitle = `${partner.name} — проекты домов | многоместа.рф`;
  const seoDescription =
    `${partner.name}: ${projectsCount} ${wordForm(projectsCount, ["проект", "проекта", "проектов"])} в каталоге многоместа.рф. ${partner.about}`;
  const partnerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: partner.name,
    url: partner.siteUrl,
    address: partner.productionAddress,
    telephone: partner.phone,
    email: partner.email,
    sameAs: [partner.siteUrl, partner.telegram].filter(Boolean),
  };

  /* ─── Layout ─── */
  return (
    <div
      className={`relative min-h-screen font-sans pb-[140px] md:pb-10 ${isPlatforma ? "" : "bg-secondary"}`}
      style={
        isPlatforma
          ? ({ backgroundColor: `hsl(${theme.page})`, ["--pt-ink" as any]: theme.ink } as React.CSSProperties)
          : undefined
      }
    >
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/partner/${makerId}`}
        image={heroImage}
        jsonLd={partnerJsonLd}
      />

      {/* Sticky compact header (mobile) */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="px-3 pt-[max(env(safe-area-inset-top),10px)] pb-2 border-b border-[hsl(var(--pt-ink)/0.12)]"
            style={{
              background: theme.light ? `hsl(${theme.page} / 0.8)` : "hsl(0 0% 0% / 0.45)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-[hsl(var(--pt-ink)/0.14)] flex items-center justify-center shrink-0" aria-label="Назад">
                <ArrowLeft className="w-[18px] h-[18px] text-[hsl(var(--pt-ink))]" strokeWidth={1.8} />
              </button>
              <div className="flex-1 min-w-0 px-1">
                <div className="text-[15px] font-semibold text-[hsl(var(--pt-ink))] truncate leading-tight">{partner.name}</div>
                <div className="text-[12px] text-[hsl(var(--pt-ink)/0.7)] truncate">{partner.category} · {partner.city}</div>
              </div>
              <button onClick={onShare} className="w-10 h-10 rounded-xl bg-[hsl(var(--pt-ink)/0.14)] flex items-center justify-center shrink-0" aria-label="Поделиться">
                <img src={shareIcon} alt="" className="w-[18px] h-[18px]" style={{ filter: theme.light ? "brightness(0)" : "brightness(0) invert(1)" }} loading="lazy" decoding="async" />
              </button>
              <button onClick={() => setMenuOpen(true)} className="w-10 h-10 rounded-xl bg-[hsl(var(--pt-ink)/0.14)] flex items-center justify-center shrink-0" aria-label="Меню">
                <Menu className="w-[18px] h-[18px] text-[hsl(var(--pt-ink))]" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isMobile && <Header />}

      <div className={`max-w-[1400px] mx-auto ${!isMobile ? "pt-[100px]" : ""}`}>
        {/* Hero */}
        <div className={!isMobile ? "px-3 md:px-3" : ""}>
          <Hero />
        </div>

        {/* Бенто: "Популярные" — горизонтальный скролл крупных карточек */}
        {isPlatforma && makerProjects.length > 0 && (
          <div className="px-3 mt-3">
            <div
              className="rounded-2xl pt-5 pb-5"
              style={{ background: `hsl(${theme.panel})`, ["--foreground" as any]: theme.ink }}
            >
              <h2 className="px-4 text-[22px] font-bold text-[hsl(var(--pt-ink))] tracking-tight">Популярные</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {makerProjects.map((p) => (
                  <div key={p.id} className="shrink-0 w-[235px] md:w-[260px]">
                    <ProjectCard projectId={p.id} height="aspect-square h-auto" singleImage onCardClick={handleProjectClick} />

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Бенто: "Хиты продаж" — большое фото-бенто с карточками внизу */}
        {isPlatforma && makerProjects.length >= 2 && (() => {
          const bgImage = hitBackdropByMakerId[makerId ?? ""] ?? makerProjects[1]?.gallery[0]?.image ?? heroImage;
          const cards = makerProjects.slice(0, 3);
          return (
            <div className="px-3 mt-3">
              <div
                className="relative overflow-hidden rounded-2xl bg-background min-h-[460px] flex flex-col"
                style={{ ["--foreground" as any]: "0 0% 100%" }}
              >
                <div className="absolute inset-0">
                  <img src={bgImage} alt="" className="w-full h-full object-cover" aria-hidden loading="lazy" />
                  {/* Тёмный градиент от середины плашки */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.05) 0%, hsl(0 0% 0% / 0.25) 40%, hsl(0 0% 0% / 0.5) 70%, hsl(0 0% 0% / 0.65) 100%)",
                    }}
                  />
                </div>

                <h2 className="relative px-5 pt-5 text-[22px] font-bold text-background tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                  Хиты продаж
                </h2>
                <div className="relative mt-auto flex gap-3 overflow-x-auto px-4 pt-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {cards.map((p) => (
                    <div key={p.id} className="shrink-0 w-[200px]">
                      <ProjectCard projectId={p.id} height="aspect-square h-auto" singleImage onCardClick={handleProjectClick} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Бенто: "По технологии" — плитки с подписью под фото */}
        {techGroups.length > 1 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl pt-5 pb-5">
              <h2 className="px-4 text-[22px] font-bold text-foreground tracking-tight">По технологии</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {techGroups.map((t) => (
                  <div key={t.tech} className="shrink-0 w-[200px]">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                      {t.image && (
                        <img src={t.image} alt={t.tech} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div className="mt-2.5 text-center text-[15px] font-semibold text-foreground">{t.tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* "Все проекты" — только Платформа */}
        {isPlatforma && makerProjects.length > 0 && (
          <div className="px-3 mt-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[24px] font-bold tracking-tight text-[hsl(var(--pt-ink))]">Все проекты</h2>
              <button
                onClick={() => setSortOpen(true)}
                className="w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center bg-[hsl(var(--pt-ink)/0.15)]"
                aria-label="Сортировка"
              >
                <ArrowUpDown className="w-[18px] h-[18px] text-[hsl(var(--pt-ink))]" strokeWidth={2.2} />
              </button>
            </div>
            <div
              className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5"
              style={{ ["--foreground" as any]: theme.ink }}
            >
              {sortedMakerProjects.map((p) => (
                <ProjectCard key={p.id} projectId={p.id} onCardClick={handleProjectClick} />
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Sort Drawer — как в каталоге */}
      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerContent
          className="mx-0 rounded-t-[20px] p-0 border-0 text-white"
          style={{
            background: "hsl(0 0% 8% / 0.55)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
          }}
        >
          <div className="px-3 pt-5 pb-3">
            <h3 className="text-[20px] font-semibold text-white px-1">Показать сначала</h3>
          </div>
          <div className="px-3 pb-6 flex flex-col gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left rounded-2xl"
                style={{ background: "hsl(0 0% 100% / 0.08)" }}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortBy === option.value ? "border-primary" : "border-white/30"}`}>
                  {sortBy === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-[16px] text-white">{option.label}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Menu Sheet (бургер) — slide in from right, transparent + blur */}
      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{ background: "hsl(0 0% 0% / 0.25)" }}
          />
          <DialogPrimitive.Content
            className="fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-md text-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-300 data-[state=open]:duration-500"
            style={{
              background: "hsl(0 0% 8% / 0.55)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
            }}
          >
          <div className="h-full overflow-y-auto pb-10">
            {/* Floating close button (right) */}
            <div className="sticky top-0 z-10 px-3 pt-3 pb-3 flex items-center justify-end"
              style={{ background: "linear-gradient(to bottom, hsl(0 0% 8% / 0.55), hsl(0 0% 8% / 0))" }}>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
            </div>

            <div className="px-3 space-y-3">
              {/* Header card */}
              <div className="flex items-start gap-3 px-1">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-[15px] font-bold shrink-0 overflow-hidden">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    partner.initials
                  )}
                </div>
                <div className="min-w-0 pt-1">
                  <div className="text-[18px] font-semibold leading-tight">{partner.name}</div>
                  <div className="text-[13px] text-white/70 mt-0.5">{rating.toFixed(1)} ★ ({reviewsLabel})</div>
                </div>
              </div>

              {/* Reviews */}
              <section className="rounded-2xl p-5" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[22px] font-bold">Отзывы</h3>
                  <button onClick={() => navigate(`/partner/${id}/reviews`, { state: { returnToMenu: true } })} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center" aria-label="Все отзывы">
                    <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-[36px] font-bold leading-none">{rating.toFixed(1)}</div>
                    <div className="text-[12px] text-white/70 mt-1">{reviewsLabel}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-white text-white" : "fill-white/20 text-white/20"}`}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
                <div className="-mr-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  <div className="flex gap-3 pr-5">
                    {hasReviews ? (
                      reviewPreviews.map((r, idx) => (
                        <div key={idx} className="shrink-0 w-[85%] snap-start rounded-xl p-4" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                          <div className="text-[14px] font-semibold mb-1">{r.title}</div>
                          <div className="text-[13px] text-white/75 leading-snug line-clamp-3">{r.body}</div>
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className={`w-3 h-3 ${i <= r.stars ? "fill-white text-white" : "fill-white/20 text-white/20"}`} strokeWidth={0} />
                            ))}
                          </div>
                          <div className="text-[11px] text-white/55 mt-2">{r.name} · {r.when}</div>
                        </div>
                      ))
                    ) : (
                      <div className="shrink-0 w-[85%] snap-start rounded-xl p-4" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                        <div className="text-[14px] font-semibold mb-1">Отзывов пока нет</div>
                        <div className="text-[13px] text-white/75 leading-snug">
                          Здесь появятся только подтвержденные отзывы из публичных источников.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Locations */}
              <section className="rounded-2xl p-5" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                <h3 className="text-[22px] font-bold mb-3">Производство</h3>
                <div className="rounded-xl p-4 flex items-center justify-between gap-3" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold truncate">{partner.name}</div>
                    <div className="text-[13px] text-white/70 mt-1">{partner.productionAddress || partner.city}</div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>
              </section>


              {/* Contact */}
              <section className="rounded-2xl p-5" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                <h3 className="text-[22px] font-bold mb-2">Контакты</h3>
                {[
                  { label: "Сайт", icon: Globe, href: partner.siteUrl },
                  partner.email ? { label: partner.email, icon: Mail, href: `mailto:${partner.email}` } : null,
                  partner.phone ? { label: partner.phone, icon: Phone, href: `tel:${partner.phone.replace(/[^+\d]/g, "")}` } : null,
                  partner.telegram ? { label: `@${partner.telegram}`, icon: Send, href: `https://t.me/${partner.telegram}` } : null,
                ].filter(Boolean).map((item: any) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href ? "_blank" : undefined}
                    rel={item.href && (item.href.startsWith("http:") || item.href.startsWith("https:")) ? "noopener noreferrer nofollow" : "noopener noreferrer"}
                    className="w-full flex items-center justify-between py-3"
                  >
                    <span className="text-[15px] text-white/90 truncate">{item.label}</span>
                    <item.icon className="w-[18px] h-[18px] text-white/70 shrink-0" strokeWidth={1.6} />
                  </a>
                ))}
              </section>

              {/* Visit site */}
              {partner.siteUrl && (
                <a
                  href={partner.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
                  style={{ background: "hsl(0 0% 100% / 0.08)" }}
                >
                  <span className="text-[15px] font-medium text-white">Перейти на сайт</span>
                  <ArrowUpRight className="w-5 h-5 text-white/80" strokeWidth={1.8} />
                </a>
              )}

              {/* Report */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{ background: "hsl(0 0% 100% / 0.08)" }}
              >
                <span className="text-[15px] font-medium text-white">Пожаловаться</span>
                <AlertCircle className="w-5 h-5 text-white/80" strokeWidth={1.6} />
              </button>

              <p className="text-[11px] leading-snug text-white/50 px-1 pt-1">
                Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
              </p>

            </div>
          </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>




      {/* Bottom Bar — CTA + tabs */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div
          className={`border-t ${isPlatforma ? "border-[hsl(var(--pt-ink)/0.12)]" : "border-border bg-background"}`}
          style={
            isPlatforma
              ? {
                  background: theme.light ? `hsl(${theme.page} / 0.75)` : "hsl(0 0% 0% / 0.45)",
                  backdropFilter: "blur(18px) saturate(140%)",
                  WebkitBackdropFilter: "blur(18px) saturate(140%)",
                }
              : undefined
          }
        >
          <div
            className="flex"
            style={{ paddingBottom: (window.navigator as any).standalone ? 'calc(env(safe-area-inset-bottom, 0px) + 16px)' : '0px' }}
          >
            {[
              { icon: Home, path: "/" },
              { icon: LayoutGrid, path: "/categories" },
              { icon: Heart, path: "/favorites" },
              { icon: MessageCircle, path: "/messages" },
            ].map((tab) => (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex items-center justify-center py-2.5 px-4"
              >
                <tab.icon
                  className={`w-[26px] h-[26px] ${isPlatforma ? "text-[hsl(var(--pt-ink))] fill-[hsl(var(--pt-ink))]" : "text-muted-foreground fill-muted-foreground"}`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
