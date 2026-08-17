import { MessageCircle } from "lucide-react";

interface SupportAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const SupportAvatar = ({ size = "md", className = "" }: SupportAvatarProps) => (
  <div
    className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-[3px] bg-secondary text-primary ${className}`}
    aria-hidden="true"
  >
    <MessageCircle className={iconClasses[size]} strokeWidth={1.8} />
  </div>
);

export default SupportAvatar;
