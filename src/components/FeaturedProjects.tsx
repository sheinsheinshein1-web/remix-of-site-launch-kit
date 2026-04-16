import { Heart, Camera, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import SwipeableGallery from "@/components/SwipeableGallery";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";

const houseImages = [house1, house2, house3, house4, house5, house6, house7, house8, house9];

function getProjectImages(mainImage: string, id: number): string[] {
  const others = houseImages.filter(img => img !== mainImage);
  // Deterministic pseudo-shuffle based on id
  const sorted = [...others].sort((a, b) => {
    const ha = a.charCodeAt(a.length - 5) ^ id;
    const hb = b.charCodeAt(b.length - 5) ^ id;
    return ha - hb;
  });
  return [mainImage, ...sorted.slice(0, 3)];
}

const projects = [
  { id: 1, name: "Тайга 72", maker: "СибМодуль", area: "72 м²", beds: 2, baths: 1, term: "30 д.", price: "2 450 000 ₽", image: house1, liked: false, likes: 124, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 2, name: "Кедр 24", maker: "УралДом", area: "24 м²", beds: 0, baths: 1, term: "14 д.", price: "890 000 ₽", image: house4, liked: true, likes: 89, hasRealPhotos: false, city: "Екатеринбург", rating: "4.8" },
  { id: 3, name: "Купол Альпика", maker: "ГлэмпингСтрой", area: "36 м²", beds: 1, baths: 1, term: "7 д.", price: "1 200 000 ₽", image: house8, liked: false, likes: 56, hasRealPhotos: true, city: "Сочи", rating: "4.6" },
  { id: 4, name: "Loft 48", maker: "МодульХаус", area: "48 м²", beds: 2, baths: 1, term: "21 д.", price: "1 750 000 ₽", image: house5, liked: false, likes: 73, hasRealPhotos: false, city: "Казань", rating: "4.7" },
  { id: 5, name: "Сосна 18", maker: "БаняМастер", area: "18 м²", beds: 0, baths: 1, term: "10 д.", price: "650 000 ₽", image: house7, liked: false, likes: 41, hasRealPhotos: true, city: "Новосибирск", rating: "4.9" },
  { id: 6, name: "Модуль 56", maker: "ЭкоДом", area: "56 м²", beds: 2, baths: 1, term: "25 д.", price: "1 950 000 ₽", image: house6, liked: false, likes: 95, hasRealPhotos: false, city: "Москва и МО", rating: "4.5" },
  { id: 7, name: "Сканди 64", maker: "НордХаус", area: "64 м²", beds: 3, baths: 2, term: "40 д.", price: "2 180 000 ₽", image: house9, liked: false, likes: 62, hasRealPhotos: true, city: "СПб", rating: "4.8" },
  { id: 8, name: "Бочка 12", maker: "БаняПро", area: "12 м²", beds: 0, baths: 1, term: "7 д.", price: "490 000 ₽", image: house7, liked: false, likes: 33, hasRealPhotos: false, city: "Тюмень", rating: "4.6" },
  { id: 9, name: "Куб 36", maker: "МодернДом", area: "36 м²", beds: 1, baths: 1, term: "18 д.", price: "1 350 000 ₽", image: house3, liked: true, likes: 108, hasRealPhotos: false, city: "Москва и МО", rating: "4.7" },
  { id: 10, name: "Мини 28", maker: "КомфортДом", area: "28 м²", beds: 1, baths: 1, term: "14 д.", price: "980 000 ₽", image: house4, liked: false, likes: 47, hasRealPhotos: true, city: "Краснодар", rating: "4.4" },
  { id: 11, name: "Барн 80", maker: "РусМодуль", area: "80 м²", beds: 3, baths: 2, term: "50 д.", price: "2 890 000 ₽", image: house2, liked: false, likes: 81, hasRealPhotos: false, city: "Москва и МО", rating: "4.9" },
  { id: 12, name: "A-Frame 32", maker: "ГлэмпПарк", area: "32 м²", beds: 1, baths: 1, term: "10 д.", price: "1 100 000 ₽", image: house4, liked: false, likes: 39, hasRealPhotos: true, city: "Алтай", rating: "4.5" },
  { id: 13, name: "Эко 44", maker: "ЗелёныйДом", area: "44 м²", beds: 2, baths: 1, term: "22 д.", price: "1 580 000 ₽", image: house5, liked: false, likes: 54, hasRealPhotos: false, city: "Ростов", rating: "4.6" },
  { id: 14, name: "Премиум 30", maker: "ПарнаяЛюкс", area: "30 м²", beds: 0, baths: 2, term: "18 д.", price: "1 250 000 ₽", image: house7, liked: true, likes: 112, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 15, name: "Хайтек 52", maker: "ТехноМодуль", area: "52 м²", beds: 2, baths: 1, term: "30 д.", price: "2 100 000 ₽", image: house6, liked: false, likes: 67, hasRealPhotos: false, city: "СПб", rating: "4.7" },
  { id: 16, name: "Уют 20", maker: "ДачаСтрой", area: "20 м²", beds: 1, baths: 1, term: "12 д.", price: "720 000 ₽", image: house9, liked: false, likes: 28, hasRealPhotos: false, city: "Воронеж", rating: "4.3" },
  { id: 17, name: "Фахверк 96", maker: "ПремиумДом", area: "96 м²", beds: 4, baths: 3, term: "60 д.", price: "3 450 000 ₽", image: house6, liked: false, likes: 143, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 18, name: "Классик 16", maker: "СтройБаня", area: "16 м²", beds: 0, baths: 1, term: "7 д.", price: "580 000 ₽", image: house7, liked: false, likes: 36, hasRealPhotos: false, city: "Уфа", rating: "4.5" },
  { id: 19, name: "Модуль 68", maker: "АльфаДом", area: "68 м²", beds: 3, baths: 2, term: "35 д.", price: "2 350 000 ₽", image: house1, liked: false, likes: 79, hasRealPhotos: true, city: "Москва и МО", rating: "4.7" },
  { id: 20, name: "Сфера 24", maker: "КуполСтрой", area: "24 м²", beds: 1, baths: 1, term: "7 д.", price: "950 000 ₽", image: house8, liked: false, likes: 52, hasRealPhotos: false, city: "Калининград", rating: "4.6" },
  { id: 21, name: "Вилла 120", maker: "ЛюксМодуль", area: "120 м²", beds: 4, baths: 3, term: "75 д.", price: "4 200 000 ₽", image: house6, liked: true, likes: 187, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 22, name: "Терем 88", maker: "РусСтиль", area: "88 м²", beds: 3, baths: 2, term: "45 д.", price: "3 100 000 ₽", image: house2, liked: false, likes: 91, hasRealPhotos: true, city: "Тверь", rating: "4.7" },
  { id: 23, name: "Компакт 22", maker: "МиниДом", area: "22 м²", beds: 1, baths: 1, term: "10 д.", price: "780 000 ₽", image: house9, liked: false, likes: 44, hasRealPhotos: false, city: "Самара", rating: "4.5" },
  { id: 24, name: "Шале 76", maker: "АльпХаус", area: "76 м²", beds: 3, baths: 2, term: "40 д.", price: "2 680 000 ₽", image: house3, liked: false, likes: 103, hasRealPhotos: true, city: "Сочи", rating: "4.8" },
  { id: 25, name: "Студия 14", maker: "МикроДом", area: "14 м²", beds: 0, baths: 1, term: "7 д.", price: "520 000 ₽", image: house5, liked: false, likes: 31, hasRealPhotos: false, city: "Пермь", rating: "4.4" },
  { id: 26, name: "Дуплекс 104", maker: "ДвойнойДом", area: "104 м²", beds: 4, baths: 2, term: "55 д.", price: "3 650 000 ₽", image: house6, liked: false, likes: 126, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 27, name: "Глэмп 28", maker: "ПаркОтель", area: "28 м²", beds: 1, baths: 1, term: "12 д.", price: "1 050 000 ₽", image: house8, liked: false, likes: 58, hasRealPhotos: false, city: "Карелия", rating: "4.6" },
  { id: 28, name: "Лофт 60", maker: "СтальДом", area: "60 м²", beds: 2, baths: 1, term: "28 д.", price: "2 020 000 ₽", image: house1, liked: false, likes: 72, hasRealPhotos: true, city: "СПб", rating: "4.7" },
  { id: 29, name: "Баррель 10", maker: "БочкаПлюс", area: "10 м²", beds: 0, baths: 1, term: "5 д.", price: "420 000 ₽", image: house7, liked: false, likes: 25, hasRealPhotos: false, city: "Челябинск", rating: "4.3" },
  { id: 30, name: "Панорама 84", maker: "ВидДом", area: "84 м²", beds: 3, baths: 2, term: "42 д.", price: "2 950 000 ₽", image: house3, liked: false, likes: 99, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 31, name: "Ранчо 110", maker: "ФермаДом", area: "110 м²", beds: 4, baths: 3, term: "65 д.", price: "3 800 000 ₽", image: house5, liked: false, likes: 134, hasRealPhotos: false, city: "Краснодар", rating: "4.8" },
];

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section>
      <div className="md:py-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[2px] gap-y-[6px] md:gap-4 md:mt-0">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="cursor-pointer overflow-hidden"
            >
              {/* Photo gallery */}
              <SwipeableGallery images={getProjectImages(project.image, project.id)} alt={project.name} height="h-[240px] md:h-[240px]">
                {/* Likes */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite({ id: project.id, badge: "", maker: project.maker, name: project.name, price: project.price, area: project.area, beds: project.beds, baths: project.baths, term: project.term, image: project.image, likes: project.likes, city: project.city }); }}
                    className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(project.id) ? "fill-red-500 text-red-500" : "text-white/70"}`} strokeWidth={1.5} />
                    <span className="text-[11px] font-medium text-white">{project.likes + (isFavorite(project.id) && !project.liked ? 1 : !isFavorite(project.id) && project.liked ? -1 : 0)}</span>
                  </button>
                </div>
              </SwipeableGallery>
              {/* Body */}
              <div className="px-[10px] pt-1 pb-1">
                <div className="text-[12px] font-bold text-foreground">{project.price}</div>
                {/* Params */}
                <div className="flex items-center gap-[5px] mt-[4px] h-4 overflow-hidden">
                  <div className="flex items-center gap-[2px] flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="block flex-shrink-0"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#999" strokeWidth="2"/><path d="M3 9h18M9 21V9" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none">{project.area}</span>
                  </div>
                  <span className="text-[10px] text-[#D0D0D0] flex-shrink-0 leading-none">·</span>
                  <div className="flex items-center gap-[2px] flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="block flex-shrink-0"><path d="M2 19v-4h20v4M2 15v-2a2 2 0 012-2h16a2 2 0 012 2v2M7 11V8a1 1 0 011-1h3v4" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none">{project.beds}</span>
                  </div>
                  <span className="text-[10px] text-[#D0D0D0] flex-shrink-0 leading-none">·</span>
                  <div className="flex items-center gap-[2px] flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="block flex-shrink-0"><path d="M4 12h16v2a6 6 0 01-6 6H10a6 6 0 01-6-6v-2zM4 12V6a2 2 0 012-2h1a2 2 0 012 2v1" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none">{project.baths}</span>
                  </div>
                  <span className="text-[10px] text-[#D0D0D0] flex-shrink-0 leading-none">·</span>
                  <div className="flex items-center gap-[2px] flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="block flex-shrink-0"><circle cx="12" cy="12" r="9" stroke="#999" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none">{project.term}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
