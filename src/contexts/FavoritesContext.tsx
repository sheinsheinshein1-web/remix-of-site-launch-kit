import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { toast } from "sonner";

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
  favoriteMakerIds: Set<string>;
  favoriteMakerItems: string[];
  favoriteCount: number;
  toggleFavorite: (item: FavItem) => void;
  toggleMakerFavorite: (makerId: string) => void;
  isFavorite: (id: number) => boolean;
  isMakerFavorite: (makerId: string) => boolean;
}

const STORAGE_KEY = "favorites";
const LEGACY_MAKERS_STORAGE_KEY = "favorite_makers";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type StoredFavorites = {
  items?: FavItem[];
  projects?: FavItem[];
  makerIds?: string[];
  savedAt?: number;
};

type FavoriteState = {
  projects: FavItem[];
  makerIds: string[];
};

const loadLegacyMakerIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LEGACY_MAKERS_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export function loadFavoriteState(): FavoriteState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { projects: [], makerIds: loadLegacyMakerIds() };

    const stored = JSON.parse(raw) as StoredFavorites;
    if (stored.savedAt && Date.now() - stored.savedAt > WEEK_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { projects: [], makerIds: loadLegacyMakerIds() };
    }

    return {
      projects: Array.isArray(stored.projects)
        ? stored.projects
        : Array.isArray(stored.items)
          ? stored.items
          : [],
      makerIds: Array.isArray(stored.makerIds)
        ? stored.makerIds.filter((id): id is string => typeof id === "string")
        : loadLegacyMakerIds(),
    };
  } catch {
    return { projects: [], makerIds: loadLegacyMakerIds() };
  }
}

function saveFavorites(projects: FavItem[], makerIds: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, makerIds, savedAt: Date.now() }));
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const initialStateRef = useRef<FavoriteState>();
  if (!initialStateRef.current) initialStateRef.current = loadFavoriteState();

  const [favoriteItems, setFavoriteItems] = useState<FavItem[]>(initialStateRef.current.projects);
  const [favoriteMakerItems, setFavoriteMakerItems] = useState<string[]>(initialStateRef.current.makerIds);
  const favoriteItemsRef = useRef(favoriteItems);
  const favoriteMakerItemsRef = useRef(favoriteMakerItems);
  const favoriteIds = new Set(favoriteItems.map((i) => i.id));
  const favoriteMakerIds = new Set(favoriteMakerItems);
  const favoriteCount = favoriteItems.length + favoriteMakerItems.length;

  useEffect(() => {
    favoriteItemsRef.current = favoriteItems;
    favoriteMakerItemsRef.current = favoriteMakerItems;
    saveFavorites(favoriteItems, favoriteMakerItems);
  }, [favoriteItems, favoriteMakerItems]);

  const toggleFavorite = useCallback((item: FavItem) => {
    const exists = favoriteItemsRef.current.some((favorite) => favorite.id === item.id);
    const next = exists
      ? favoriteItemsRef.current.filter((favorite) => favorite.id !== item.id)
      : [...favoriteItemsRef.current, item];

    favoriteItemsRef.current = next;
    setFavoriteItems(next);
    toast.success(exists ? "Проект удалён из избранного" : "Проект добавлен в избранное");
  }, []);

  const toggleMakerFavorite = useCallback((makerId: string) => {
    const exists = favoriteMakerItemsRef.current.includes(makerId);
    const next = exists
      ? favoriteMakerItemsRef.current.filter((favoriteMakerId) => favoriteMakerId !== makerId)
      : [...favoriteMakerItemsRef.current, makerId];

    favoriteMakerItemsRef.current = next;
    setFavoriteMakerItems(next);
    toast.success(exists ? "Производитель удалён из избранного" : "Производитель добавлен в избранное");
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteItems.some((i) => i.id === id),
    [favoriteItems]
  );

  const isMakerFavorite = useCallback(
    (makerId: string) => favoriteMakerItems.includes(makerId),
    [favoriteMakerItems],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteItems,
        favoriteMakerIds,
        favoriteMakerItems,
        favoriteCount,
        toggleFavorite,
        toggleMakerFavorite,
        isFavorite,
        isMakerFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
