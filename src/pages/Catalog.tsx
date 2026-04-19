import { useState, useEffect, useRef } from "react";
import { formatSpecs } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronDown, X, ArrowUpDown, Ruler, BedDouble, Bath, Heart, Star, Camera, Columns2, Redo2, Truck, Maximize } from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { useFavorites } from "@/contexts/FavoritesContext";
import MobileTabBar from "@/components/MobileTabBar";
import Header from "@/components/Header";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";
import SwipeableGallery from "@/components/SwipeableGallery";
import { navigateWithTransition } from "@/lib/viewTransition";

import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";
import wideHouse from "@/assets/wide-house-1.webp";
import cabin31_1 from "@/assets/cabin-31-1.webp";

const allHouseImages = [house1, house2, house3, house4, house5, house6, house7, house8, house9];

function getProjectImages(mainImage: string, id: number): string[] {
  const others = allHouseImages.filter(img => img !== mainImage);
  const sorted = [...others].sort((a, b) => {
    const ha = a.charCodeAt(a.length - 5) ^ id;
    const hb = b.charCodeAt(b.length - 5) ^ id;
    return ha - hb;
  });
  return [mainImage, ...sorted.slice(0, 3)];
}

const chips = ["Все", "Для жизни", "Для выходных", "Для сдачи", "Для семьи", "Быстро поставить"];
const mobileChips = ["Все", "Для жизни", "Для выходных", "Для сдачи", "Для семьи", "Быстро поставить"];

const bundles = [
  { name: "До 1 млн ₽", count: "38 проектов" },
  { name: "Малый участок", count: "24 проекта" },
  { name: "Быстрый монтаж", count: "31 проект" },
  { name: "Для ИЖС", count: "56 проектов" },
  { name: "Хиты сезона", count: "12 проектов" },
];

const catalogItems = [
  { id: 1, badge: "Жилой дом", maker: "СибМодуль · Новосибирск", name: "Тайга 72", price: "2 450 000 ₽", area: "72 м²", beds: 2, baths: 1, term: "30 д.", rooms: "2 спальни", purpose: "ИЖС / СНТ", image: house1, fav: false, likes: 124, city: "Москва и МО", floors: 1, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: true, hasInstallment: true },
  { id: 2, badge: "Баня", maker: "УралДом · Екатеринбург", name: "Кедр 24", price: "890 000 ₽", area: "24 м²", beds: 0, baths: 1, term: "14 д.", rooms: "2 комнаты", purpose: "ИЖС / СНТ", image: house7, fav: true, likes: 89, city: "Екатеринбург", floors: 1, suitableFor: ["Выходные / дача"], technology: "Модульный дом", completion: "С отделкой", insulation: "до −30°C", features: ["Сауна"], style: "Классический", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.6, hasShowroom: false, hasInstallment: false },
  { id: 3, badge: "Глэмпинг", maker: "ГлэмпингСтрой · Сочи", name: "Купол Альпика", price: "1 200 000 ₽", area: "36 м²", beds: 1, baths: 1, term: "7 д.", rooms: "1 спальня", purpose: "Коммерческое", image: house8, fav: false, likes: 56, city: "Краснодарский край", floors: 1, suitableFor: ["Сдача в аренду", "Для одного / пары"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C", features: ["Панорамные окна"], style: "A-Frame", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.5, hasShowroom: false, hasInstallment: true },
  { id: 4, badge: "Жилой дом", maker: "МодульХаус · Москва", name: "Loft 48", price: "1 750 000 ₽", area: "48 м²", beds: 1, baths: 1, term: "21 д.", rooms: "1 спальня", purpose: "ИЖС", image: house5, fav: false, likes: 203, city: "Москва и МО", floors: 1, suitableFor: ["Для одного / пары", "Выходные / дача"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Панорамные окна", "Второй свет"], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.9, hasShowroom: true, hasInstallment: true },
  { id: 5, badge: "Гостевой корпус", maker: "ДомКомплект · Казань", name: "Гостевой G-120", price: "3 900 000 ₽", area: "120 м²", beds: 3, baths: 2, term: "45 д.", rooms: "3 спальни", purpose: "Коммерческое", image: house6, fav: false, likes: 31, city: "Казань", floors: 2, suitableFor: ["Сдача в аренду", "Гостевой дом"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Антресоль"], style: "Барнхаус", landSize: "от 10 соток", hasRealPhotos: false, rating: 4.3, hasShowroom: false, hasInstallment: true },
  { id: 6, badge: "Жилой дом", maker: "АрктикДом · Мурманск", name: "Север 96", price: "3 200 000 ₽", area: "96 м²", beds: 2, baths: 2, term: "40 д.", rooms: "2 спальни", purpose: "ИЖС / СНТ", image: house3, fav: false, likes: 72, city: "Санкт-Петербург и ЛО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "СИП-Префаб", completion: "Под ключ", insulation: "до −40°C", features: ["Терраса", "Второй свет"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.7, hasShowroom: true, hasInstallment: true },
  { id: 7, badge: "Баня", maker: "ПарнаяЛюкс · Тюмень", name: "Премиум 30", price: "1 250 000 ₽", area: "30 м²", beds: 0, baths: 2, term: "15 д.", rooms: "2 комнаты", purpose: "ИЖС / СНТ", image: house7, fav: false, likes: 112, city: "Тюмень", floors: 1, suitableFor: ["Выходные / дача"], technology: "Модульный дом", completion: "С отделкой", insulation: "до −40°C", features: ["Сауна", "Терраса"], style: "Классический", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: false, hasInstallment: false },
  { id: 8, badge: "Жилой дом", maker: "НордХаус · Петрозаводск", name: "Сканди 64", price: "2 180 000 ₽", area: "64 м²", beds: 2, baths: 1, term: "35 д.", rooms: "2 спальни", purpose: "ИЖС", image: house9, fav: false, likes: 62, city: "Новосибирск", floors: 1, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "С отделкой", insulation: "до −30°C", features: ["Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: false, rating: 4.4, hasShowroom: false, hasInstallment: true },
  { id: 9, badge: "Глэмпинг", maker: "ГлэмпПарк · Краснодар", name: "A-Frame 32", price: "1 100 000 ₽", area: "32 м²", beds: 1, baths: 1, term: "10 д.", rooms: "1 спальня", purpose: "Коммерческое", image: house4, fav: false, likes: 39, city: "Вся Россия", floors: 1, suitableFor: ["Сдача в аренду", "Для одного / пары"], technology: "Модульный дом", completion: "Базовая", insulation: "до −20°C", features: ["Панорамные окна", "Второй свет"], style: "A-Frame", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.2, hasShowroom: false, hasInstallment: false },
  { id: 10, badge: "Жилой дом", maker: "ТехноМодуль · Самара", name: "Хайтек 52", price: "2 100 000 ₽", area: "52 м²", beds: 1, baths: 1, term: "28 д.", rooms: "1 спальня", purpose: "ИЖС", image: house2, fav: true, likes: 67, city: "Самара", floors: 1, suitableFor: ["Для одного / пары", "Постоянное проживание"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Панорамные окна", "Антресоль"], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.6, hasShowroom: true, hasInstallment: true },
  { id: 11, badge: "Жилой дом", maker: "ПремиумДом · Москва", name: "Фахверк 96", price: "3 450 000 ₽", area: "96 м²", beds: 3, baths: 2, term: "60 д.", rooms: "3 спальни", purpose: "ИЖС", image: house6, fav: false, likes: 143, city: "Москва и МО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Панорамные окна", "Второй свет"], style: "Барнхаус", landSize: "от 10 соток", hasRealPhotos: true, rating: 4.9, hasShowroom: true, hasInstallment: true },
  { id: 12, badge: "Гостевой корпус", maker: "ДачаСтрой · Воронеж", name: "Уют 20", price: "720 000 ₽", area: "20 м²", beds: 1, baths: 1, term: "10 д.", rooms: "1 комната", purpose: "СНТ", image: house4, fav: false, likes: 28, city: "Воронеж", floors: 1, suitableFor: ["Выходные / дача", "Гостевой дом"], technology: "Модульный дом", completion: "Базовая", insulation: "до −20°C", features: [], style: "Классический", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.1, hasShowroom: false, hasInstallment: false },
  { id: 13, badge: "Жилой дом", maker: "ЭкоДом · Ростов", name: "Модуль 56", price: "1 950 000 ₽", area: "56 м²", beds: 2, baths: 1, term: "25 д.", rooms: "2 спальни", purpose: "ИЖС / СНТ", image: house6, fav: false, likes: 95, city: "Ростов", floors: 1, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса"], style: "Минимализм / Loft", landSize: "6–10 соток", hasRealPhotos: false, rating: 4.5, hasShowroom: false, hasInstallment: true },
  { id: 14, badge: "Баня", maker: "БаняМастер · Новосибирск", name: "Сосна 18", price: "650 000 ₽", area: "18 м²", beds: 0, baths: 1, term: "10 д.", rooms: "1 комната", purpose: "СНТ", image: house7, fav: false, likes: 41, city: "Новосибирск", floors: 1, suitableFor: ["Выходные / дача"], technology: "Модульный дом", completion: "С отделкой", insulation: "до −30°C", features: ["Сауна"], style: "Классический", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.9, hasShowroom: false, hasInstallment: false },
  { id: 15, badge: "Жилой дом", maker: "РусМодуль · Тверь", name: "Барн 80", price: "2 890 000 ₽", area: "80 м²", beds: 3, baths: 2, term: "50 д.", rooms: "3 спальни", purpose: "ИЖС", image: house2, fav: false, likes: 81, city: "Москва и МО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Второй свет"], style: "Барнхаус", landSize: "от 10 соток", hasRealPhotos: false, rating: 4.9, hasShowroom: true, hasInstallment: true },
  { id: 16, badge: "Глэмпинг", maker: "КуполСтрой · Калининград", name: "Сфера 24", price: "950 000 ₽", area: "24 м²", beds: 1, baths: 1, term: "7 д.", rooms: "1 спальня", purpose: "Коммерческое", image: house8, fav: false, likes: 52, city: "Калининград", floors: 1, suitableFor: ["Сдача в аренду", "Для одного / пары"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C", features: ["Панорамные окна"], style: "A-Frame", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.6, hasShowroom: false, hasInstallment: false },
  { id: 17, badge: "Жилой дом", maker: "ЛюксМодуль · Москва", name: "Вилла 120", price: "4 200 000 ₽", area: "120 м²", beds: 4, baths: 3, term: "75 д.", rooms: "4 спальни", purpose: "ИЖС", image: house6, fav: false, likes: 187, city: "Москва и МО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Панорамные окна", "Второй свет"], style: "Минимализм / Loft", landSize: "от 10 соток", hasRealPhotos: true, rating: 4.9, hasShowroom: true, hasInstallment: true },
  { id: 18, badge: "Жилой дом", maker: "РусСтиль · Тверь", name: "Терем 88", price: "3 100 000 ₽", area: "88 м²", beds: 3, baths: 2, term: "45 д.", rooms: "3 спальни", purpose: "ИЖС", image: house2, fav: false, likes: 91, city: "Тверь", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса"], style: "Классический", landSize: "от 10 соток", hasRealPhotos: true, rating: 4.7, hasShowroom: false, hasInstallment: true },
  { id: 19, badge: "Гостевой корпус", maker: "МиниДом · Самара", name: "Компакт 22", price: "780 000 ₽", area: "22 м²", beds: 1, baths: 1, term: "10 д.", rooms: "1 комната", purpose: "СНТ", image: house9, fav: false, likes: 44, city: "Самара", floors: 1, suitableFor: ["Выходные / дача", "Гостевой дом"], technology: "Модульный дом", completion: "Базовая", insulation: "до −20°C", features: [], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.5, hasShowroom: false, hasInstallment: false },
  { id: 20, badge: "Жилой дом", maker: "АльпХаус · Сочи", name: "Шале 76", price: "2 680 000 ₽", area: "76 м²", beds: 3, baths: 2, term: "40 д.", rooms: "3 спальни", purpose: "ИЖС", image: house3, fav: false, likes: 103, city: "Краснодарский край", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −20°C", features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: true, hasInstallment: true },
  { id: 21, badge: "Баня", maker: "БочкаПлюс · Челябинск", name: "Баррель 10", price: "420 000 ₽", area: "10 м²", beds: 0, baths: 1, term: "5 д.", rooms: "1 комната", purpose: "СНТ", image: house7, fav: false, likes: 25, city: "Челябинск", floors: 1, suitableFor: ["Выходные / дача"], technology: "Модульный дом", completion: "Базовая", insulation: "до −30°C", features: ["Сауна"], style: "Классический", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.3, hasShowroom: false, hasInstallment: false },
  { id: 22, badge: "Жилой дом", maker: "ВидДом · Москва", name: "Панорама 84", price: "2 950 000 ₽", area: "84 м²", beds: 3, baths: 2, term: "42 д.", rooms: "3 спальни", purpose: "ИЖС", image: house3, fav: false, likes: 99, city: "Москва и МО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "СИП-Префаб", completion: "Под ключ", insulation: "до −30°C", features: ["Панорамные окна", "Второй свет", "Терраса"], style: "Минимализм / Loft", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: true, hasInstallment: true },
  { id: 23, badge: "Жилой дом", maker: "ФермаДом · Краснодар", name: "Ранчо 110", price: "3 800 000 ₽", area: "110 м²", beds: 4, baths: 3, term: "65 д.", rooms: "4 спальни", purpose: "ИЖС", image: house5, fav: false, likes: 134, city: "Краснодарский край", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −20°C", features: ["Терраса", "Антресоль"], style: "Барнхаус", landSize: "от 10 соток", hasRealPhotos: false, rating: 4.8, hasShowroom: false, hasInstallment: true },
  { id: 24, badge: "Глэмпинг", maker: "ПаркОтель · Карелия", name: "Глэмп 28", price: "1 050 000 ₽", area: "28 м²", beds: 1, baths: 1, term: "12 д.", rooms: "1 спальня", purpose: "Коммерческое", image: house8, fav: false, likes: 58, city: "Вся Россия", floors: 1, suitableFor: ["Сдача в аренду", "Для одного / пары"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C", features: ["Панорамные окна"], style: "A-Frame", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.6, hasShowroom: false, hasInstallment: false },
  { id: 25, badge: "Жилой дом", maker: "СтальДом · СПб", name: "Лофт 60", price: "2 020 000 ₽", area: "60 м²", beds: 2, baths: 1, term: "28 д.", rooms: "2 спальни", purpose: "ИЖС", image: house1, fav: false, likes: 72, city: "Санкт-Петербург и ЛО", floors: 1, suitableFor: ["Постоянное проживание", "Для одного / пары"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Панорамные окна", "Антресоль"], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.7, hasShowroom: true, hasInstallment: true },
  { id: 26, badge: "Жилой дом", maker: "ДвойнойДом · Москва", name: "Дуплекс 104", price: "3 650 000 ₽", area: "104 м²", beds: 4, baths: 2, term: "55 д.", rooms: "4 спальни", purpose: "ИЖС", image: house6, fav: false, likes: 126, city: "Москва и МО", floors: 2, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Домокомплект", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Второй свет"], style: "Барнхаус", landSize: "от 10 соток", hasRealPhotos: true, rating: 4.9, hasShowroom: true, hasInstallment: true },
  { id: 27, badge: "Баня", maker: "СтройБаня · Уфа", name: "Классик 16", price: "580 000 ₽", area: "16 м²", beds: 0, baths: 1, term: "7 д.", rooms: "1 комната", purpose: "СНТ", image: house7, fav: false, likes: 36, city: "Уфа", floors: 1, suitableFor: ["Выходные / дача"], technology: "Модульный дом", completion: "Базовая", insulation: "до −30°C", features: ["Сауна"], style: "Классический", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.5, hasShowroom: false, hasInstallment: false },
  { id: 28, badge: "Жилой дом", maker: "АльфаДом · Москва", name: "Модуль 68", price: "2 350 000 ₽", area: "68 м²", beds: 3, baths: 2, term: "35 д.", rooms: "3 спальни", purpose: "ИЖС", image: house1, fav: false, likes: 79, city: "Москва и МО", floors: 1, suitableFor: ["Постоянное проживание", "Для семьи"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.7, hasShowroom: true, hasInstallment: true },
  { id: 29, badge: "Гостевой корпус", maker: "МикроДом · Пермь", name: "Студия 14", price: "520 000 ₽", area: "14 м²", beds: 0, baths: 1, term: "7 д.", rooms: "1 комната", purpose: "СНТ", image: house5, fav: false, likes: 31, city: "Пермь", floors: 1, suitableFor: ["Выходные / дача", "Гостевой дом"], technology: "Модульный дом", completion: "Базовая", insulation: "до −20°C", features: [], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.4, hasShowroom: false, hasInstallment: false },
  { id: 30, badge: "Жилой дом", maker: "КомфортДом · Краснодар", name: "Мини 28", price: "980 000 ₽", area: "28 м²", beds: 1, baths: 1, term: "14 д.", rooms: "1 спальня", purpose: "ИЖС / СНТ", image: house4, fav: false, likes: 47, city: "Краснодарский край", floors: 1, suitableFor: ["Для одного / пары", "Выходные / дача"], technology: "Модульный дом", completion: "С отделкой", insulation: "до −20°C", features: [], style: "Классический", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.4, hasShowroom: false, hasInstallment: false },
  { id: 31, badge: "Жилой дом", maker: "МодернДом · Москва", name: "Куб 36", price: "1 350 000 ₽", area: "36 м²", beds: 1, baths: 1, term: "18 д.", rooms: "1 спальня", purpose: "ИЖС / СНТ", image: house3, fav: true, likes: 108, city: "Москва и МО", floors: 1, suitableFor: ["Для одного / пары", "Выходные / дача"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Панорамные окна"], style: "Минимализм / Loft", landSize: "3–6 соток", hasRealPhotos: false, rating: 4.7, hasShowroom: false, hasInstallment: true },
  { id: 32, badge: "Жилой дом", maker: "Платформа · Екатеринбург", name: "Wide House", price: "5 480 000 ₽", area: "46,4 м²", beds: 2, baths: 1, term: "30 д.", rooms: "2 спальни", purpose: "ИЖС / СНТ", image: wideHouse, fav: false, likes: 64, city: "Екатеринбург", floors: 1, suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: true, hasInstallment: true },
  { id: 33, badge: "Жилой дом", maker: "Платформа · Екатеринбург", name: "Barn House", price: "1 680 000 ₽", area: "42,9 м²", beds: 1, baths: 1, term: "30 д.", rooms: "1 спальня", purpose: "ИЖС / СНТ", image: cabin31_1, fav: false, likes: 48, city: "Екатеринбург", floors: 1, suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"], technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C", features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "3–6 соток", hasRealPhotos: true, rating: 4.8, hasShowroom: true, hasInstallment: true },
];

const sidebarFilters = [
  {
    title: "ТИП ОБЪЕКТА",
    options: [
      { label: "Жилой дом", count: 84, checked: true },
      { label: "Баня", count: 46, checked: true },
      { label: "Глэмпинг", count: 31, checked: false },
      { label: "Гостевой корпус", count: 28, checked: false },
      { label: "Коммерция", count: 25, checked: false },
    ],
  },
  {
    title: "НАЗНАЧЕНИЕ",
    options: [
      { label: "ИЖС", checked: true },
      { label: "СНТ", checked: true },
      { label: "ЛПХ", checked: false },
      { label: "Коммерческое", checked: false },
    ],
  },
  {
    title: "СРОК МОНТАЖА",
    options: [
      { label: "до 2 недель", checked: false },
      { label: "2–4 недели", checked: true },
      { label: "4–8 недель", checked: false },
    ],
  },
  {
    title: "КОМПЛЕКТАЦИЯ",
    options: [
      { label: "Под ключ", checked: true },
      { label: "Без отделки", checked: false },
      { label: "Только корпус", checked: false },
    ],
  },
];

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <rect x="0" y="0" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="5" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="10" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

const GridIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="0" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

const FavButton = ({ active, onClick, size = "md", count }: { active: boolean; onClick: (e: React.MouseEvent) => void; size?: "sm" | "md"; count?: number }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full ${
      size === "sm" ? "px-2 py-[3px]" : "px-2.5 py-[5px]"
    }`}
  >
    <Heart
      className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} ${active ? "fill-red-500 text-red-500" : "text-white/70"}`}
      strokeWidth={1.5}
    />
    {count !== undefined && <span className={`${size === "sm" ? "text-[10px]" : "text-[11px]"} font-medium text-white`}>{count}</span>}
  </button>
);

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [catalogSearch, setCatalogSearch] = useState(searchParams.get("q") || "");
  const [activeChip, setActiveChip] = useState("Все");

  const resetAllFilters = () => {
    setFilterPriceMinVal(500000);
    setFilterPriceMaxVal(5000000);
    setFilterAreaMin("");
    setFilterAreaMax("");
    setFilterSuitableFor(new Set());
    setFilterMoveIn(new Set());
    setFilterBedrooms(new Set());
    setFilterBathrooms(new Set());
    setFilterFloors(new Set());
    setFilterKit(new Set());
    setFilterInsulation(new Set());
    setFilterFeatures(new Set());
    setFilterStyle(new Set());
    setFilterLandType(new Set());
    setFilterExtras(new Set());
  };

  const selectChip = (chip: string) => {
    resetAllFilters();
    setActiveChip(chip);
    switch (chip) {
      case "Для жизни":
        setFilterSuitableFor(new Set(["Постоянное проживание"]));
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterBathrooms(new Set(["1"]));
        setFilterInsulation(new Set(["до −30°C", "до −40°C"]));
        setFilterKit(new Set(["Под ключ", "С отделкой"]));
        break;
      case "Для выходных":
        setFilterSuitableFor(new Set(["Выходные / дача"]));
        setFilterPriceMaxVal(2000000);
        setFilterAreaMax("60");
        break;
      case "Для сдачи":
        setFilterSuitableFor(new Set(["Сдача в аренду"]));
        setFilterKit(new Set(["Под ключ"]));
        setFilterExtras(new Set(["Рассрочка"]));
        break;
      case "Для семьи":
        setFilterSuitableFor(new Set(["Для семьи"]));
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterBathrooms(new Set(["2+"]));
        setFilterAreaMin("60");
        setFilterFloors(new Set(["1", "2"]));
        break;
      case "Быстро поставить":
        setFilterMoveIn(new Set(["до 2 недель"]));
        setFilterKit(new Set(["Модульный дом"]));
        break;
    }
  };
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const { isFavorite, toggleFavorite } = useFavorites();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCollapsed(y > 60 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 1. Подходит для
  const [filterSuitableFor, setFilterSuitableFor] = useState<Set<string>>(new Set());
  // 2. Цена
  const [filterPriceMinVal, setFilterPriceMinVal] = useState(500000);
  const [filterPriceMaxVal, setFilterPriceMaxVal] = useState(5000000);
  const PRICE_MIN = 0;
  const PRICE_MAX = 7000000;
  // 3. Базовые параметры
  const [filterAreaMin, setFilterAreaMin] = useState("");
  const [filterAreaMax, setFilterAreaMax] = useState("");
  const [filterMoveIn, setFilterMoveIn] = useState<Set<string>>(new Set());
  // 4. Планировка
  const [filterBedrooms, setFilterBedrooms] = useState<Set<string>>(new Set());
  const [filterBathrooms, setFilterBathrooms] = useState<Set<string>>(new Set());
  const [filterFloors, setFilterFloors] = useState<Set<string>>(new Set());
  // 5. Комплектация
  const [filterKit, setFilterKit] = useState<Set<string>>(new Set());
  // 6. Утепление
  const [filterInsulation, setFilterInsulation] = useState<Set<string>>(new Set());
  // 7. Особенности
  const [filterFeatures, setFilterFeatures] = useState<Set<string>>(new Set());
  // 8. Стиль
  const [filterStyle, setFilterStyle] = useState<Set<string>>(new Set());
  // 9. Участок
  const [filterLandType, setFilterLandType] = useState<Set<string>>(new Set());
  // 10. Регион и производитель (dropdowns, no set state needed beyond display)
  // 11. Дополнительно
  const [filterExtras, setFilterExtras] = useState<Set<string>>(new Set());

  // Apply URL search params as initial filters and keep local state synced with URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const beds = searchParams.get("beds");
    const baths = searchParams.get("baths");

    resetAllFilters();
    setActiveChip("Все");
    setCatalogSearch(q);
    setFilterPriceMinVal(minPrice ? parseInt(minPrice) : 500000);
    setFilterPriceMaxVal(maxPrice ? parseInt(maxPrice) : 5000000);
    setFilterAreaMin(minArea || "");
    setFilterAreaMax(maxArea || "");
    setFilterBedrooms(beds ? new Set([beds]) : new Set());
    setFilterBathrooms(baths ? new Set([baths]) : new Set());
  }, [searchParams]);

  const toggleInSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) => {
    setter(prev => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  };

  const applySuitablePreset = (preset: string) => {
    const isActive = filterSuitableFor.has(preset);
    if (isActive) {
      // Deselect: remove from set, reset related filters
      setFilterSuitableFor(prev => { const n = new Set(prev); n.delete(preset); return n; });
      setFilterAreaMin("");
      setFilterAreaMax("");
      setFilterBedrooms(new Set());
      setFilterBathrooms(new Set());
      setFilterFloors(new Set());
      setFilterKit(new Set());
      setFilterInsulation(new Set());
      setFilterExtras(new Set());
      setFilterPriceMinVal(500000);
      setFilterPriceMaxVal(5000000);
      return;
    }
    // Activate preset
    setFilterSuitableFor(new Set([preset]));
    // Reset all numeric/set filters first
    setFilterAreaMin("");
    setFilterAreaMax("");
    setFilterBedrooms(new Set());
    setFilterBathrooms(new Set());
    setFilterFloors(new Set());
    setFilterKit(new Set());
    setFilterInsulation(new Set());
    setFilterExtras(new Set());
    setFilterPriceMinVal(500000);
    setFilterPriceMaxVal(5000000);

    switch (preset) {
      case "Для одного / пары":
        setFilterAreaMax("45");
        setFilterBedrooms(new Set(["1"]));
        break;
      case "Для семьи":
        setFilterAreaMin("50");
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterBathrooms(new Set(["2+"]));
        setFilterFloors(new Set(["1", "2"]));
        break;
      case "Постоянное проживание":
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterInsulation(new Set(["до −30°C", "до −40°C"]));
        setFilterKit(new Set(["Под ключ", "С отделкой"]));
        break;
      case "Выходные / дача":
        setFilterPriceMaxVal(2000000);
        setFilterAreaMax("60");
        break;
      case "Сдача в аренду":
        setFilterKit(new Set(["Под ключ"]));
        setFilterExtras(new Set(["Рассрочка"]));
        break;
      case "Гостевой дом":
        setFilterAreaMax("35");
        setFilterBedrooms(new Set(["1"]));
        break;
    }
  };

  const suitableToChip: Record<string, string> = {
    "Постоянное проживание": "Для жизни",
    "Выходные / дача": "Для выходных",
    "Сдача в аренду": "Для сдачи",
    "Для семьи": "Для семьи",
  };

  useEffect(() => {
    if (filterSuitableFor.size === 0 && filterMoveIn.size === 0) {
      // Only reset to "Все" if no other filters set the chip
      if (activeChip !== "Все") setActiveChip("Все");
      return;
    }
    if (filterMoveIn.has("до 2 недель") && filterSuitableFor.size === 0) {
      if (activeChip !== "Быстро поставить") setActiveChip("Быстро поставить");
      return;
    }
    if (filterSuitableFor.size === 1) {
      const val = Array.from(filterSuitableFor)[0];
      const chip = suitableToChip[val];
      if (chip && activeChip !== chip) setActiveChip(chip);
    }
  }, [filterSuitableFor, filterMoveIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters = filterPriceMinVal !== 500000 || filterPriceMaxVal !== 5000000 || filterAreaMin !== "" || filterAreaMax !== "" || filterBedrooms.size > 0 || filterBathrooms.size > 0 || filterSuitableFor.size > 0 || filterMoveIn.size > 0 || filterFloors.size > 0 || filterKit.size > 0 || filterInsulation.size > 0 || filterFeatures.size > 0 || filterStyle.size > 0 || filterLandType.size > 0 || filterExtras.size > 0;

  const priceNum = (s: string) => parseInt(s.replace(/\D/g, ""), 10);
  const areaNum = (s: string) => parseFloat(s.replace(/[^\d.]/g, ""));
  const termNum = (s: string) => parseInt(s.replace(/\D/g, ""), 10);
  const stemSearchTerm = (term: string) => {
    if (term.length <= 3) return term; // Don't stem short words like "дом", "баня" etc.
    return term.replace(/(иями|ями|ами|ого|ему|ому|ыми|ими|иях|ях|ах|ов|ев|ей|ой|ий|ый|ая|ое|ее|ые|ие|ья|ью|ия|ям|ам|ом|ем|ию|ю|у|а|я|ы|и|е|о)$/u, "");
  };

  let normalizedCatalogQuery = ` ${catalogSearch.toLowerCase().replace(/ё/g, "е")} `;

  normalizedCatalogQuery = normalizedCatalogQuery
    .replace(/(^|\s)1\s*этаж[а-я]*(?=\s|$)/gu, " одноэтажный ")
    .replace(/(^|\s)2\s*этаж[а-я]*(?=\s|$)/gu, " двухэтажный ");

  // Always strip price/unit tokens so they don't block text matching
  normalizedCatalogQuery = normalizedCatalogQuery
    .replace(/(^|\s)(?:до|от)\s*[\d.,]+\s*(?:млн|милл[а-я]*|миллион[а-я]*|тыс[а-я]*|руб[а-я]*|₽)(?=\s|$)/gu, " ")
    .replace(/(^|\s)[\d.,]+\s*(?:млн|милл[а-я]*|миллион[а-я]*|тыс[а-я]*|руб[а-я]*|₽)(?=\s|$)/gu, " ");

  // Always strip bedroom/bathroom/area tokens
  normalizedCatalogQuery = normalizedCatalogQuery.replace(
    /(^|\s)(?:\d+|одно|одна|одним|две|два|двух|три|трех|трёх|четыре|четырех|четырёх|пять|пяти)\s*[- ]?(?:спальн[а-я]*|комнат[а-я]*|сп[а-я]*)(?=\s|$)/gu, " "
  );
  normalizedCatalogQuery = normalizedCatalogQuery.replace(/(^|\s)\d+\s*(?:санузл[а-я]*|ванн[а-я]*)(?=\s|$)/gu, " ");
  normalizedCatalogQuery = normalizedCatalogQuery.replace(/(^|\s)(?:до|от)\s*[\d.,]+\s*(?:м2|м²|кв|квадрат[а-я]*|метр[а-я]*)(?=\s|$)/gu, " ");

  const catalogSearchTerms = normalizedCatalogQuery
    .replace(/(^|\s)(для|и|в|на|по|с|к|у|под|над|при|от|до)(?=\s|$)/gu, " ")
    .split(/[^а-яёa-z0-9]+/iu)
    .map((term) => stemSearchTerm(term))
    .filter((term) => term.length > 1);

  const filteredItems = catalogItems.filter(item => {
    if (catalogSearchTerms.length > 0) {
      const floorsLabel = item.floors === 1 ? "одноэтажный 1 этаж" : item.floors === 2 ? "двухэтажный 2 этажа" : `${item.floors} этаж`;
      const bedsLabel = item.beds === 0 ? "студия без спальни" : `${item.beds} спальня ${item.beds} спальни ${item.beds} спален`;
      const haystack = [
        item.name,
        item.badge,
        item.maker,
        item.city,
        item.purpose,
        item.technology,
        item.completion,
        item.insulation,
        item.style,
        item.rooms,
        floorsLabel,
        bedsLabel,
        item.suitableFor.join(" "),
        item.features.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .replace(/ё/g, "е");

      if (!catalogSearchTerms.every((term) => haystack.includes(term))) return false;
    }
    // Цена
    const price = priceNum(item.price);
    if (price < filterPriceMinVal || price > filterPriceMaxVal) return false;
    // Площадь
    const area = areaNum(item.area);
    if (filterAreaMin && area < parseFloat(filterAreaMin)) return false;
    if (filterAreaMax && area > parseFloat(filterAreaMax)) return false;
    // Спальни
    if (filterBedrooms.size > 0) {
      const beds = item.beds;
      const match = Array.from(filterBedrooms).some(f => {
        if (f === "Студия") return beds === 0;
        if (f === "3+") return beds >= 3;
        return beds === parseInt(f);
      });
      if (!match) return false;
    }
    // Санузлы
    if (filterBathrooms.size > 0) {
      const match = Array.from(filterBathrooms).some(f => {
        if (f === "2+") return item.baths >= 2;
        return item.baths === parseInt(f);
      });
      if (!match) return false;
    }
    // Подходит для
    if (filterSuitableFor.size > 0) {
      if (!Array.from(filterSuitableFor).some(f => item.suitableFor.includes(f))) return false;
    }
    // Срок до заселения
    if (filterMoveIn.size > 0) {
      const days = termNum(item.term);
      const match = Array.from(filterMoveIn).some(f => {
        if (f === "до 2 недель") return days <= 14;
        if (f === "2–4 недели") return days > 14 && days <= 30;
        if (f === "1–2 месяца") return days > 30 && days <= 60;
        return false;
      });
      if (!match) return false;
    }
    // Этажей
    if (filterFloors.size > 0 && !filterFloors.has(String(item.floors))) return false;
    // Технология + Комплектация (both use filterKit)
    if (filterKit.size > 0) {
      const techMatch = filterKit.has(item.technology);
      const compMatch = filterKit.has(item.completion);
      if (!techMatch && !compMatch) return false;
    }
    // Утепление
    if (filterInsulation.size > 0 && !filterInsulation.has(item.insulation)) return false;
    // Особенности
    if (filterFeatures.size > 0) {
      if (!Array.from(filterFeatures).some(f => item.features.includes(f))) return false;
    }
    // Стиль
    if (filterStyle.size > 0 && !filterStyle.has(item.style)) return false;
    // Размер участка
    if (filterLandType.size > 0 && !filterLandType.has(item.landSize)) return false;
    // Дополнительно
    if (filterExtras.size > 0) {
      const match = Array.from(filterExtras).every(f => {
        if (f === "Фото реальных домов") return item.hasRealPhotos;
        if (f === "Рейтинг 4.5+") return item.rating >= 4.5;
        if (f === "Есть шоурум и выставочные дома") return item.hasShowroom;
        if (f === "Рассрочка") return item.hasInstallment;
        return true;
      });
      if (!match) return false;
    }
    // Чипы категорий
    if (activeChip !== "Все") {
      const chipMap: Record<string, (i: typeof item) => boolean> = {
        "Для жизни": i => i.suitableFor.includes("Постоянное проживание"),
        "Для выходных": i => i.suitableFor.includes("Выходные / дача"),
        "Для сдачи": i => i.suitableFor.includes("Сдача в аренду"),
        "Для семьи": i => i.suitableFor.includes("Для семьи"),
        "Быстро поставить": i => termNum(i.term) <= 14,
      };
      const check = chipMap[activeChip];
      if (check && !check(item)) return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "cheap": return priceNum(a.price) - priceNum(b.price);
      case "expensive": return priceNum(b.price) - priceNum(a.price);
      case "area_asc": return areaNum(a.area) - areaNum(b.area);
      case "area_desc": return areaNum(b.area) - areaNum(a.area);
      case "fast": return termNum(a.term) - termNum(b.term);
      case "popular": return b.likes - a.likes;
      case "new": return b.id - a.id;
      default: return 0;
    }
  });

  const toggleFav = (item: typeof catalogItems[0]) => {
    toggleFavorite({
      id: item.id, badge: item.badge, maker: item.maker, name: item.name,
      price: item.price, area: item.area, beds: item.beds, baths: item.baths,
      term: item.term, image: item.image, likes: item.likes, city: item.city,
    });
  };

  return (
    <div className="min-h-screen bg-secondary font-sans pb-[calc(72px+max(env(safe-area-inset-bottom),16px))] md:pb-0">
      {/* Desktop: reuse site header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile header — search bar + filters */}
      <div className="md:hidden sticky top-0 z-40">
        <div className="bg-background rounded-b-2xl shadow-sm">
          {/* Search bar */}
          <div className="px-4 pt-5 pb-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="shrink-0 text-muted-foreground">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <SearchDropdown
              className="flex-1"
              inputClassName="bg-secondary"
              initialQuery={catalogSearch}
              onQueryChange={setCatalogSearch}
              showFilterButton
              onFilterClick={() => setFiltersOpen(true)}
              hasActiveFilters={hasActiveFilters}
            />
            <button className="shrink-0" onClick={() => { if (navigator.share) { navigator.share({ title: 'Каталог', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 100 103" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
                <path d="M53 20 L84 50 L53 80 L53 65 C30 65 15 75 10 93 C10 68 15 38 53 33 Z" />
              </svg>
            </button>
          </div>

          {/* View toggle, sort & chips — collapse on scroll */}
          <div className={`transition-all duration-300 overflow-hidden ${collapsed ? "max-h-0 pb-0" : "max-h-[60px] pb-2.5"}`}>
            <div className="px-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <div className="flex bg-secondary rounded-xl p-1 gap-0.5 h-10 shrink-0">
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-[32px] rounded-lg flex items-center justify-center ${viewMode === "list" ? "bg-background" : ""}`}
                >
                  <ListIcon active={viewMode === "list"} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-[32px] rounded-lg flex items-center justify-center ${viewMode === "grid" ? "bg-background" : ""}`}
                >
                  <GridIcon active={viewMode === "grid"} />
                </button>
              </div>
              <button onClick={() => setSortOpen(true)} className="flex items-center justify-center bg-secondary rounded-xl w-10 h-10 shrink-0">
                <ArrowUpDown className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
              </button>
              {mobileChips.map((chip) => (
                <button
                  key={chip}
                 onClick={() => selectChip(chip)}
                  className={`text-[14px] rounded-xl px-4 py-[8px] whitespace-nowrap flex-shrink-0 transition-colors ${
                    activeChip === chip
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-secondary text-foreground/70 font-normal"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop catalog content */}
      <div className="md:max-w-[1400px] md:mx-auto md:pt-[108px] md:pb-6 md:bg-background md:rounded-b-2xl">
        <div className="hidden md:block px-8 pt-8 mb-4"></div>
        <div className="md:flex md:px-8 md:gap-4">
          {/* Sidebar bento card */}
          <aside className="hidden md:block w-[280px] flex-shrink-0">
          <div className="px-1 py-1 sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* Reset */}
            {hasActiveFilters && (
              <button onClick={() => { resetAllFilters(); setActiveChip("Все"); }} className="text-sm font-normal text-primary mb-4">Сбросить фильтры</button>
            )}

            {/* Подходит для */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ПОДХОДИТ ДЛЯ</div>
              <div className="flex flex-wrap gap-1.5">
                {["Постоянное проживание", "Выходные / дача", "Сдача в аренду", "Гостевой дом", "Для семьи", "Для одного / пары"].map(c => (
                  <button key={c} onClick={() => applySuitablePreset(c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterSuitableFor.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Цена */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ЦЕНА, ₽</div>
              <div className="flex items-end gap-[2px] h-8 mb-2">
                {[85,100,75,60,50,40,35,28,20,15,10,5].map((h, i) => {
                  const barMin = (i / 12) * PRICE_MAX;
                  const barMax = ((i + 1) / 12) * PRICE_MAX;
                  const active = barMin < filterPriceMaxVal && barMax > filterPriceMinVal;
                  return <div key={i} className={`flex-1 rounded-t-sm ${active ? "bg-primary" : "bg-border"}`} style={{ height: `${h}%` }} />;
                })}
              </div>
              <div className="relative h-6 mb-2">
                <div className="absolute top-[11px] left-0 right-0 h-1 bg-border rounded-full" />
                <div className="absolute top-[11px] h-1 bg-primary rounded-full" style={{ left: `${(filterPriceMinVal / PRICE_MAX) * 100}%`, right: `${100 - (filterPriceMaxVal / PRICE_MAX) * 100}%` }} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMinVal}
                  onChange={e => { const v = Math.min(Number(e.target.value), filterPriceMaxVal - 50000); setFilterPriceMinVal(v); }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMaxVal}
                  onChange={e => { const v = Math.max(Number(e.target.value), filterPriceMinVal + 50000); setFilterPriceMaxVal(v); }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterPriceMinVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMinVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[12px] bg-secondary rounded-xl px-2.5 py-2 text-foreground outline-none" />
                <input value={filterPriceMaxVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMaxVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[12px] bg-secondary rounded-xl px-2.5 py-2 text-foreground outline-none" />
              </div>
            </div>

            {/* Площадь */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ПЛОЩАДЬ, М²</div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterAreaMin} onChange={e => setFilterAreaMin(e.target.value)} placeholder="от" className="text-[12px] bg-secondary rounded-xl px-2.5 py-2 text-foreground placeholder:text-muted-foreground outline-none" />
                <input value={filterAreaMax} onChange={e => setFilterAreaMax(e.target.value)} placeholder="до" className="text-[12px] bg-secondary rounded-xl px-2.5 py-2 text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
            </div>

            {/* Срок до заселения */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">СРОК ДО ЗАСЕЛЕНИЯ</div>
              <div className="flex flex-wrap gap-1.5">
                {["до 2 недель", "2–4 недели", "1–2 месяца"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterMoveIn, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterMoveIn.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Спальни */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">СПАЛЬНИ</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["Студия", "1", "2", "3+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBedrooms, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterBedrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">САНУЗЛЫ</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["1", "2+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBathrooms, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterBathrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ЭТАЖЕЙ</div>
              <div className="flex flex-wrap gap-1.5">
                {["1", "2"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFloors, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterFloors.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Технология */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ТЕХНОЛОГИЯ</div>
              <div className="flex flex-wrap gap-1.5">
                {["Модульный дом", "Домокомплект", "СИП-Префаб"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterKit, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterKit.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Комплектация */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">КОМПЛЕКТАЦИЯ</div>
              <div className="flex flex-wrap gap-1.5">
                {["Базовая", "С отделкой", "Под ключ"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterKit, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterKit.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Утепление */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">УТЕПЛЕНИЕ</div>
              <div className="flex flex-wrap gap-1.5">
                {["до −20°C", "до −30°C", "до −40°C"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterInsulation, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterInsulation.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Особенности */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ОСОБЕННОСТИ</div>
              <div className="flex flex-wrap gap-1.5">
                {["Терраса", "Панорамные окна", "Второй свет", "Антресоль", "Сауна"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFeatures, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterFeatures.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Стиль */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">СТИЛЬ</div>
              <div className="flex flex-wrap gap-1.5">
                {["A-Frame", "Барнхаус", "Скандинавский", "Минимализм / Loft", "Классический"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterStyle, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterStyle.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Размер участка */}
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">РАЗМЕР УЧАСТКА</div>
              <div className="flex flex-wrap gap-1.5">
                {["3–6 соток", "6–10 соток", "от 10 соток"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterLandType, c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterLandType.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Дополнительно */}
            <div>
              <div className="text-[10px] tracking-[2px] font-normal text-muted-foreground mb-2.5">ДОПОЛНИТЕЛЬНО</div>
              <div className="flex flex-wrap gap-1.5">
                {["Фото реальных домов", "Рейтинг 4.5+", "Есть шоурум", "Рассрочка"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterExtras, c === "Есть шоурум" ? "Есть шоурум и выставочные дома" : c)}
                    className={`text-[12px] rounded-xl px-3 py-[6px] transition-colors ${
                      filterExtras.has(c === "Есть шоурум" ? "Есть шоурум и выставочные дома" : c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="hidden md:block flex-1 py-0">
          {/* Sort row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-foreground">{sortedItems.length} проектов</span>
              <div className="relative inline-flex items-center gap-1 cursor-pointer bg-secondary rounded-xl px-3 py-1.5">
                <span className="text-[13px] font-medium text-foreground">
                  {sortOptions.find(o => o.value === sortBy)?.label ?? "Сортировка"}
                </span>
                <ChevronDown className="w-4 h-4 text-foreground" strokeWidth={2} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Сортировка"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex bg-background rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-8 h-7 rounded-lg flex items-center justify-center ${viewMode === "grid" ? "bg-secondary" : ""}`}
              >
                <GridIcon active={viewMode === "grid"} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-8 h-7 rounded-lg flex items-center justify-center ${viewMode === "list" ? "bg-secondary" : ""}`}
              >
                <ListIcon active={viewMode === "list"} />
              </button>
            </div>
          </div>

          {/* Desktop Grid view */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-4">
              {sortedItems.map((item) => (
                <div key={item.id} data-project-id={item.id} className="cursor-pointer group bg-background rounded-2xl overflow-hidden" onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)}>
                  <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="h-[260px]">
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <FavButton active={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFav(item); }} count={item.likes + (isFavorite(item.id) && !item.fav ? 1 : !isFavorite(item.id) && item.fav ? -1 : 0)} />
                    </div>
                  </SwipeableGallery>
                  <div className="px-[10px] pt-1 pb-1">
                    <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{item.name}</h2>
                    <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {item.price}</div>
                    <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                      <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{item.area}</span>
                      <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{item.beds}</span>
                      <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{item.baths}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop List view — same minimal format as grid */
            <div className="grid grid-cols-2 gap-4">
              {sortedItems.map((item) => (
                <div key={item.id} data-project-id={item.id} className="flex gap-4 cursor-pointer bg-background rounded-2xl overflow-hidden group" onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)}>
                  <div className="w-[220px] h-[180px] flex-shrink-0 relative overflow-hidden rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <FavButton active={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFav(item); }} size="sm" count={item.likes + (isFavorite(item.id) && !item.fav ? 1 : !isFavorite(item.id) && item.fav ? -1 : 0)} />
                    </div>
                  </div>
                  <div className="flex-1 py-2 pr-3 flex flex-col justify-center">
                    <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{item.name}</h2>
                    <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {item.price}</div>
                    <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                      <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{item.area}</span>
                      <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{item.beds}</span>
                      <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{item.baths}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile content */}
      <div className="md:hidden">
        {viewMode === "list" ? (
          <div className="mt-2 py-3 bg-background rounded-2xl px-2">
            <div className="grid grid-cols-1 gap-y-[6px]">
            {sortedItems.map((item) => (
              <div key={item.id} data-project-id={item.id} className="cursor-pointer overflow-hidden" onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)}>
                <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="aspect-[3/4] h-auto">
                  <div className="absolute top-2 right-2 z-10">
                    <FavButton active={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFav(item); }} size="sm" count={item.likes + (isFavorite(item.id) && !item.fav ? 1 : !isFavorite(item.id) && item.fav ? -1 : 0)} />
                  </div>
                </SwipeableGallery>
                <div className="px-[10px] pt-1 pb-1">
                  <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{item.name}</h2>
                  <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {item.price}</div>
                  <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                    <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{item.area}</span>
                    <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{item.beds}</span>
                    <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{item.baths}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className="mt-2 py-3 bg-background rounded-2xl px-2">
            <div className="grid grid-cols-2 gap-x-[2px] gap-y-[6px]">
            {sortedItems.map((item) => (
              <div key={item.id} data-project-id={item.id} className="cursor-pointer overflow-hidden" onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)}>
                <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="aspect-[3/4] h-auto">
                  <div className="absolute top-2 right-2 z-10">
                    <FavButton active={isFavorite(item.id)} onClick={(e) => { e.stopPropagation(); toggleFav(item); }} size="sm" count={item.likes + (isFavorite(item.id) && !item.fav ? 1 : !isFavorite(item.id) && item.fav ? -1 : 0)} />
                  </div>
                </SwipeableGallery>
                {/* Body */}
                <div className="px-[10px] pt-1 pb-1">
                  <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{item.name}</h2>
                  <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {item.price}</div>
                  <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                    <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{item.area}</span>
                    <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{item.beds}</span>
                    <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{item.baths}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Sort Drawer */}
      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerContent className="mx-0 rounded-t-[20px] p-0">
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-[20px] font-semibold text-foreground">Показать сначала</h3>
          </div>
          <div className="bg-secondary rounded-xl mx-4 mb-6 divide-y divide-border/50">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortBy === option.value ? "border-primary" : "border-muted-foreground/30"}`}>
                  {sortBy === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-[16px] text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Filter Sheet */}
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent className="max-h-[90vh] mx-0 rounded-t-[28px] p-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="text-lg font-bold text-foreground">Фильтры</span>
            <div className="flex items-center gap-4">
              <button onClick={() => { resetAllFilters(); setActiveChip("Все"); }} className="text-sm font-normal text-primary">Сбросить</button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Scrollable filter sections */}
          <div className="flex-1 overflow-y-auto">

            {/* 1. Подходит для */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ПОДХОДИТ ДЛЯ</div>
              <div className="flex flex-wrap gap-2">
                {["Постоянное проживание", "Выходные / дача", "Сдача в аренду", "Гостевой дом", "Для семьи", "Для одного / пары"].map(c => (
                  <button key={c} onClick={() => applySuitablePreset(c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterSuitableFor.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 2. Цена */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ЦЕНА, ₽</div>
              <div className="flex items-end gap-[2px] h-9 mb-2">
                {[85,100,75,60,50,40,35,28,20,15,10,5].map((h, i) => {
                  const barMin = (i / 12) * PRICE_MAX;
                  const barMax = ((i + 1) / 12) * PRICE_MAX;
                  const active = barMin < filterPriceMaxVal && barMax > filterPriceMinVal;
                  return <div key={i} className={`flex-1 rounded-t-sm ${active ? "bg-primary" : "bg-border"}`} style={{ height: `${h}%` }} />;
                })}
              </div>
              <div className="relative h-6 mb-2.5">
                <div className="absolute top-[11px] left-0 right-0 h-1 bg-border rounded-full" />
                <div className="absolute top-[11px] h-1 bg-primary rounded-full" style={{ left: `${(filterPriceMinVal / PRICE_MAX) * 100}%`, right: `${100 - (filterPriceMaxVal / PRICE_MAX) * 100}%` }} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMinVal}
                  onChange={e => { const v = Math.min(Number(e.target.value), filterPriceMaxVal - 50000); setFilterPriceMinVal(v); }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMaxVal}
                  onChange={e => { const v = Math.max(Number(e.target.value), filterPriceMinVal + 50000); setFilterPriceMaxVal(v); }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterPriceMinVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMinVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground outline-none" />
                <input value={filterPriceMaxVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMaxVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground outline-none" />
              </div>
            </div>

            {/* 3. Базовые параметры */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ПЛОЩАДЬ, М²</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input value={filterAreaMin} onChange={e => setFilterAreaMin(e.target.value)} placeholder="от" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
                <input value={filterAreaMax} onChange={e => setFilterAreaMax(e.target.value)} placeholder="до" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5 mt-1">РАЗМЕРЫ, М</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input placeholder="Длина" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
                <input placeholder="Ширина" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ВЫСОТА ПОТОЛКОВ, М</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input placeholder="от" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
                <input placeholder="до" className="text-[13px] bg-secondary rounded-[10px] px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
            </div>

            {/* Срок до заселения */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">СРОК ДО ЗАСЕЛЕНИЯ</div>
              <div className="flex flex-wrap gap-2">
                {["до 2 недель", "2–4 недели", "1–2 месяца"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterMoveIn, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterMoveIn.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 4. Планировка */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">СПАЛЬНИ</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Студия", "1", "2", "3+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBedrooms, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterBedrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">САНУЗЛЫ</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["1", "2+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBathrooms, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterBathrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ЭТАЖЕЙ</div>
              <div className="flex flex-wrap gap-2">
                {["1", "2"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFloors, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterFloors.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Технология */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ТЕХНОЛОГИЯ</div>
              <div className="flex flex-wrap gap-2">
                {["Модульный дом", "Домокомплект", "СИП-Префаб"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterKit, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterKit.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 5. Комплектация */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">КОМПЛЕКТАЦИЯ</div>
              <div className="flex flex-wrap gap-2">
                {["Базовая", "С отделкой", "Под ключ"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterKit, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterKit.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 6. Утепление */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">УТЕПЛЕНИЕ</div>
              <div className="flex flex-wrap gap-2">
                {["до −20°C", "до −30°C", "до −40°C"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterInsulation, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterInsulation.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 7. Особенности (чекбоксы) */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ОСОБЕННОСТИ</div>
              <div className="flex flex-wrap gap-2">
                {["Терраса", "Панорамные окна", "Второй свет", "Антресоль", "Сауна"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFeatures, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterFeatures.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 8. Стиль */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">СТИЛЬ</div>
              <div className="flex flex-wrap gap-2">
                {["A-Frame", "Барнхаус", "Скандинавский", "Минимализм / Loft", "Классический"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterStyle, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterStyle.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 9. Размер участка */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">РАЗМЕР УЧАСТКА</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["3–6 соток", "6–10 соток", "от 10 соток"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterLandType, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterLandType.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 10. Регион и производитель */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">РЕГИОН ДОСТАВКИ</div>
              <div className="bg-secondary rounded-[10px] px-3.5 py-2.5 flex items-center justify-between mb-3">
                <span className="text-[13px] text-muted-foreground">Москва и МО</span>
                <span className="text-muted-foreground text-sm">▾</span>
              </div>
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ПРОИЗВОДИТЕЛЬ</div>
              <div className="bg-secondary rounded-[10px] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Выберите производителя</span>
                <span className="text-muted-foreground text-sm">▾</span>
              </div>
            </div>

            {/* 11. Дополнительно */}
            <div className="px-5 py-3.5">
              <div className="text-[11px] tracking-[1.5px] font-medium text-muted-foreground mb-2.5">ДОПОЛНИТЕЛЬНО</div>
              <div className="flex flex-wrap gap-2">
                {["Фото реальных домов", "Рейтинг 4.5+", "Есть шоурум и выставочные дома", "Рассрочка"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterExtras, c)}
                    className={`text-[13px] rounded-xl px-3.5 py-[7px] transition-colors ${
                      filterExtras.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="px-5 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-border bg-background">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full bg-primary text-primary-foreground font-medium text-[15px] rounded-2xl py-4"
            >
              Показать {filteredItems.length} {filteredItems.length === 1 ? "проект" : filteredItems.length < 5 ? "проекта" : "проектов"}
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      <MobileTabBar />
    </div>
  );
};

export default Catalog;
