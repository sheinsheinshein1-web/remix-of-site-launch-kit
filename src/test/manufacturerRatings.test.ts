import { describe, expect, it } from "vitest";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";

describe("manufacturer ratings", () => {
  it("uses published reviews as the only rating source", () => {
    const summary = getManufacturerRatingSummary("bygge");

    expect(summary.hasReviews).toBe(true);
    expect(summary.hasRating).toBe(true);
    expect(summary.ratingSource).toBe("reviews");
    expect(summary.rating).toBe(5);
  });

  it("returns 0.0 when a manufacturer has no reviews", () => {
    const summary = getManufacturerRatingSummary("glavles");

    expect(summary.hasReviews).toBe(false);
    expect(summary.hasRating).toBe(false);
    expect(summary.ratingSource).toBe("none");
    expect(summary.rating).toBe(0);
    expect(summary.totalCount).toBe(0);
  });

  it("uses the same Yandex rating for Platforma everywhere", () => {
    const summary = getManufacturerRatingSummary("platforma");

    expect(summary.hasReviews).toBe(true);
    expect(summary.hasRating).toBe(true);
    expect(summary.ratingSource).toBe("yandex");
    expect(summary.sourceLabel).toBe("Яндекс");
    expect(summary.rating).toBe(4.3);
    expect(summary.totalCount).toBe(5);
    expect(summary.reviewsLabel).toBe("5 отзывов");
  });
});
