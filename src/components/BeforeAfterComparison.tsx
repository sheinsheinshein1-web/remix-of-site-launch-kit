import { useId, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

type BeforeAfterComparisonProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  layout?: "feature" | "hero";
};

const BeforeAfterComparison = ({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = "Исходник",
  afterLabel = "Рендер",
  layout = "feature",
}: BeforeAfterComparisonProps) => {
  const [position, setPosition] = useState(52);
  const inputId = useId();

  return (
    <figure className={`group relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-[#e9ebef] focus-within:ring-2 focus-within:ring-primary/35 ${layout === "hero" ? "xl:aspect-[16/10]" : "xl:aspect-square"}`}>
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <img
        src={beforeSrc}
        alt={beforeAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        loading="lazy"
        decoding="async"
      />

      <span className="absolute left-3 top-3 rounded-[3px] bg-[#171614]/78 px-2.5 py-1.5 text-[12px] font-medium text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-[3px] bg-[#171614]/78 px-2.5 py-1.5 text-[12px] font-medium text-white">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.16)]"
        style={{ left: `${position}%` }}
        aria-hidden
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] bg-white text-[#342d27] shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
          <ChevronsLeftRight className="h-4 w-4" strokeWidth={1.7} />
        </span>
      </div>

      <label htmlFor={inputId} className="sr-only">Показать исходник или художественный рендер</label>
      <input
        id={inputId}
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-col-resize opacity-0"
        aria-valuetext={`${position}% исходного изображения`}
      />
    </figure>
  );
};

export default BeforeAfterComparison;
