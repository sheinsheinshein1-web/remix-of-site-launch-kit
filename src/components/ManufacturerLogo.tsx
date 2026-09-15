import type { ComponentProps } from "react";
import type { Manufacturer } from "@/data/manufacturers";
import { cn } from "@/lib/utils";

type ManufacturerLogoProps = {
  manufacturer: Pick<Manufacturer, "name" | "initials" | "logo" | "logoFit" | "logoBackground">;
  className?: string;
  loading?: ComponentProps<"img">["loading"];
};

const ManufacturerLogo = ({
  manufacturer,
  className,
  loading = "lazy",
}: ManufacturerLogoProps) => {
  const backgroundClassName = manufacturer.logoBackground === "dark"
    ? "border border-border bg-[#342d27] text-white"
    : manufacturer.logoBackground === "transparent"
      ? "bg-transparent text-[#342d27]"
      : "border border-border bg-white text-[#342d27]";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] font-semibold uppercase tracking-[0.06em]",
        backgroundClassName,
        className,
      )}
      aria-hidden="true"
    >
      {manufacturer.logo ? (
        <img
          src={manufacturer.logo}
          alt=""
          width={96}
          height={96}
          loading={loading}
          decoding="async"
          className={cn(
            "h-full w-full",
            manufacturer.logoFit === "cover" ? "object-cover" : "object-contain p-[10%]",
          )}
        />
      ) : manufacturer.initials}
    </span>
  );
};

export default ManufacturerLogo;
