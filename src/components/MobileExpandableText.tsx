import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileExpandableTextProps {
  text: string;
  contentId: string;
  className?: string;
}

const MobileExpandableText = ({ text, contentId, className }: MobileExpandableTextProps) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measureOverflow = useCallback(() => {
    const content = contentRef.current;
    if (!content || expanded) return;

    if (!window.matchMedia("(max-width: 767px)").matches) {
      setIsOverflowing(false);
      return;
    }

    const fullText = content.cloneNode(true) as HTMLParagraphElement;
    fullText.removeAttribute("id");
    fullText.classList.remove("line-clamp-4");
    fullText.setAttribute("aria-hidden", "true");
    Object.assign(fullText.style, {
      position: "fixed",
      inset: "0 auto auto -9999px",
      width: `${content.clientWidth}px`,
      maxWidth: "none",
      height: "auto",
      maxHeight: "none",
      margin: "0",
      overflow: "visible",
      visibility: "hidden",
      pointerEvents: "none",
    });
    document.body.appendChild(fullText);

    const fullHeight = fullText.scrollHeight;
    fullText.remove();
    setIsOverflowing(fullHeight > content.clientHeight + 1);
  }, [expanded]);

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useEffect(() => {
    if (expanded) return;

    measureOverflow();

    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(content);

    return () => observer.disconnect();
  }, [expanded, measureOverflow, text]);

  return (
    <>
      <p
        ref={contentRef}
        id={contentId}
        className={cn(className, !expanded && "line-clamp-4 md:line-clamp-none")}
      >
        {text}
      </p>
      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden dark:text-foreground"
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {expanded ? "Свернуть" : "Подробнее"}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>
      )}
    </>
  );
};

export default MobileExpandableText;
