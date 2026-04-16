import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface FavItem {
  id: number;
  badge: string;
  maker: string;
  name: string;
  price: string;
  area: string;
  beds: number;
  baths: number;
  term: string;
  image: string;
  likes: number;
  city: string;
}

interface FavoritesContextType {
  favoriteIds: Set<number>;
  favoriteItems: FavItem[];
  toggleFavorite: (item: FavItem) => void;
  isFavorite: (id: number) => boolean;
}

const STORAGE_KEY = "favorites";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function loadFavorites(): FavItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const { items, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > WEEK_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return items;
  } catch { return []; }
}

function saveFavorites(items: FavItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, savedAt: Date.now() }));
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavItem[]>(() => loadFavorites());
  const favoriteIds = new Set(favoriteItems.map((i) => i.id));

  useEffect(() => {
    saveFavorites(favoriteItems);
  }, [favoriteItems]);

  const toggleFavorite = useCallback((item: FavItem) => {
    setFavoriteItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteItems.some((i) => i.id === id),
    [favoriteItems]
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favoriteItems, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
