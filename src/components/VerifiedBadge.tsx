type VerifiedBadgeProps = {
  className?: string;
};

const VerifiedBadge = ({ className = "" }: VerifiedBadgeProps) => (
  <span
    className={`inline-flex h-5 shrink-0 items-center rounded-[var(--radius)] bg-primary/10 px-2 text-[10px] font-medium tracking-normal text-primary ${className}`}
  >
    Проверено
  </span>
);

export default VerifiedBadge;
