import { Skeleton } from "@/components/ui/skeleton";

interface ProjectCardSkeletonProps {
  height?: string;
}

const ProjectCardSkeleton = ({ height = "h-[260px]" }: ProjectCardSkeletonProps) => {
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <Skeleton className={`${height} w-full rounded-[var(--radius)]`} />
      <div className="space-y-1.5 px-1 pb-1.5 pt-2">
        <Skeleton className="h-[14px] w-[58%] rounded-md" />
        <Skeleton className="h-[12px] w-[76%] rounded-md" />
        <Skeleton className="h-[10px] w-[64%] rounded-md" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
