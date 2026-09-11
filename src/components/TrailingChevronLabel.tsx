import { ChevronRight } from "lucide-react";

type TrailingChevronLabelProps = {
  text: string;
};

/** Keeps the chevron attached to the final word while allowing the title to wrap. */
const TrailingChevronLabel = ({ text }: TrailingChevronLabelProps) => {
  const words = text.trim().split(/\s+/);
  const lastWord = words.pop() ?? "";
  const prefix = words.join(" ");

  return (
    <>
      {prefix && <>{prefix}{" "}</>}
      <span className="inline-flex whitespace-nowrap align-baseline">
        <span>{lastWord}</span>
        <ChevronRight
          className="ml-2 h-5 w-5 shrink-0 self-center transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6"
          strokeWidth={1.8}
          aria-hidden
        />
      </span>
    </>
  );
};

export default TrailingChevronLabel;
