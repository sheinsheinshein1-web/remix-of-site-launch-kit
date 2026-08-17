import { beforeEach, describe, expect, it } from "vitest";
import { loadFavoriteState, type FavItem } from "@/contexts/FavoritesContext";

const project: FavItem = {
  id: 377,
  badge: "Модульный дом",
  maker: "Cubber Prefab",
  name: "HOUSE 48",
  price: "4 800 000 ₽",
  area: "48 м²",
  beds: 2,
  baths: 1,
  term: "от 30 д.",
  image: "/house.webp",
  likes: 10,
  city: "Кемеровская область",
};

describe("единое хранилище избранного", () => {
  beforeEach(() => localStorage.clear());

  it("переносит старые проекты и производителей в одну модель", () => {
    localStorage.setItem("favorites", JSON.stringify({ items: [project], savedAt: Date.now() }));
    localStorage.setItem("favorite_makers", JSON.stringify(["cubber"]));

    expect(loadFavoriteState()).toEqual({ projects: [project], makerIds: ["cubber"] });
  });

  it("читает новый общий формат", () => {
    localStorage.setItem("favorites", JSON.stringify({
      projects: [project],
      makerIds: ["cubber", "bygge"],
      savedAt: Date.now(),
    }));

    expect(loadFavoriteState()).toEqual({
      projects: [project],
      makerIds: ["cubber", "bygge"],
    });
  });
});
