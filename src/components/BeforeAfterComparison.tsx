import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";

const MIN_POSITION = 8;
const MAX_POSITION = 92;
const DIRECTION_THRESHOLD = 6;

type PointerGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  mode: "pending" | "dragging";
};

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
  const inputRef = useRef<HTMLInputElement>(null);
  const gestureRef = useRef<PointerGesture | null>(null);

  const updatePosition = (clientX: number, target: HTMLDivElement) => {
    const bounds = target.getBoundingClientRect();
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(MAX_POSITION, Math.max(MIN_POSITION, nextPosition)));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;

    const gesture: PointerGesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      mode: event.pointerType === "mouse" ? "dragging" : "pending",
    };

    gestureRef.current = gesture;
    inputRef.current?.focus({ preventScroll: true });

    if (gesture.mode === "dragging") {
      event.currentTarget.setPointerCapture(event.pointerId);
      updatePosition(event.clientX, event.currentTarget);
      event.preventDefault();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (gesture.mode === "pending") {
      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;

      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DIRECTION_THRESHOLD) return;

      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        gestureRef.current = null;
        return;
      }

      gesture.mode = "dragging";
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    updatePosition(event.clientX, event.currentTarget);
    event.preventDefault();
  };

  const finishPointerGesture = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (!cancelled) updatePosition(event.clientX, event.currentTarget);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    gestureRef.current = null;
  };

  return (
    <figure className={`group relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-[#e9ebef] focus-within:ring-2 focus-within:ring-primary/35 ${layout === "hero" ? "xl:aspect-[16/10]" : "xl:aspect-square"}`}>
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <img
        src={beforeSrc}
        alt={beforeAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        loading="lazy"
        decoding="async"
        draggable={false}
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
        ref={inputRef}
        id={inputId}
        type="range"
        min={MIN_POSITION}
        max={MAX_POSITION}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        aria-valuetext={`${position}% исходного изображения`}
      />
      <div
        className="absolute inset-0 z-10 cursor-col-resize touch-pan-y select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointerGesture(event)}
        onPointerCancel={(event) => finishPointerGesture(event, true)}
        aria-hidden
      />
    </figure>
  );
};

export default BeforeAfterComparison;
