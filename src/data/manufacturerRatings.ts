import { getPartnerReviewSummary } from "@/data/partnerReviews";

export const getManufacturerRatingSummary = (makerId?: string) => {
  const reviewSummary = getPartnerReviewSummary(makerId);
  return {
    ...reviewSummary,
    hasRating: reviewSummary.hasReviews,
    ratingSource: reviewSummary.hasReviews ? "reviews" as const : "none" as const,
  };
};
