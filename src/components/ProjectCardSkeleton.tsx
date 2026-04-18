import { Skeleton } from "@/components/ui/skeleton";

interface ProjectCardSkeletonProps {
  height?: string;
}

const ProjectCardSkeleton = ({ height = "h-[260px]" }: ProjectCardSkeletonProps) => {
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <Skeleton className={`${height} w-full rounded-[14px]`} />
      <div className="px-[10px] pt-1 pb-1 space-y-[6px] mt-1">
        <Skeleton className="h-[12px] w-[60%] rounded-md" />
        <Skeleton className="h-[10px] w-[80%] rounded-md" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
