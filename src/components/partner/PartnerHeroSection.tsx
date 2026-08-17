import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const PartnerHeroSection = ({ className, ...props }: ComponentPropsWithoutRef<"section">) => (
  <section
    className={cn(
      "mx-auto w-full max-w-[1400px] px-4 pb-12 pt-[128px] sm:px-8 md:pb-16 md:pt-[192px] lg:px-12",
      className,
    )}
    {...props}
  />
);

export default PartnerHeroSection;
