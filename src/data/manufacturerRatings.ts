import { formatReviewCount, getPartnerReviewSummary } from "@/data/partnerReviews";
import { manufacturerRegistry } from "@/data/manufacturers";

export const getExternalManufacturerRating = (makerId?: string) =>
  makerId ? manufacturerRegistry[makerId]?.externalRating : undefined;

export const getManufacturerRatingSummary = (makerId?: string) => {
  const externalRating = getExternalManufacturerRating(makerId);
  if (externalRating) {
    return {
      rating: externalRating.rating,
      reviewsLabel: formatReviewCount(externalRating.totalCount),
      totalCount: externalRating.totalCount,
      hasReviews: externalRating.totalCount > 0,
      hasRating: externalRating.totalCount > 0,
      ratingSource: externalRating.source,
      sourceLabel: externalRating.sourceLabel,
    };
  }

  const reviewSummary = getPartnerReviewSummary(makerId);
  return {
    ...reviewSummary,
    hasRating: reviewSummary.hasReviews,
    ratingSource: reviewSummary.hasReviews ? "reviews" as const : "none" as const,
    sourceLabel: reviewSummary.hasReviews ? "Много места" : undefined,
  };
};
