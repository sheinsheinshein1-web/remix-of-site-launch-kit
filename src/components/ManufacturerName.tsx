import VerifiedBadge from "@/components/VerifiedBadge";
import { cn } from "@/lib/utils";
import { isVerifiedMaker } from "@/lib/verifiedMakers";

type ManufacturerNameProps = {
  makerId?: string;
  name: string;
  className?: string;
  nameClassName?: string;
  badgeClassName?: string;
};

const ManufacturerName = ({
  makerId,
  name,
  className,
  nameClassName,
  badgeClassName,
}: ManufacturerNameProps) => (
  <span className={cn("flex min-w-0 max-w-full items-center gap-2", className)}>
    <span className={cn("min-w-0 truncate", nameClassName)}>{name}</span>
    {isVerifiedMaker(makerId) && <VerifiedBadge className={badgeClassName} />}
  </span>
);

export default ManufacturerName;
