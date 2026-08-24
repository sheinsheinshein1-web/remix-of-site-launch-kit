import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";

const MIN_POSITION = 8;
const MAX_POSITION = 92;
const DIRECTION_THRESHOLD = 3;
const HORIZONTAL_INTENT_RATIO = 1.35;

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
  const figureRef = useRef<HTMLElement>(null);
  const gestureRef = useRef<PointerGesture | null>(null);

  const updatePosition = (clientX: number) => {
    const bounds = figureRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;

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

    if (gesture.mode === "dragging") {
      inputRef.current?.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      updatePosition(event.clientX);
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

      const horizontalDistance = Math.abs(deltaX);
      const verticalDistance = Math.abs(deltaY);

      // A finger rarely travels in a perfectly straight line. Prefer page
      // scrolling for ambiguous diagonal gestures and activate the comparison
      // only when the user is clearly dragging horizontally.
      if (horizontalDistance < verticalDistance * HORIZONTAL_INTENT_RATIO) {
        gestureRef.current = null;
        return;
      }

      gesture.mode = "dragging";
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    updatePosition(event.clientX);
    event.preventDefault();
  };

  const finishPointerGesture = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    if (!cancelled && gesture.mode === "dragging") {
      updatePosition(event.clientX);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    gestureRef.current = null;
  };

  return (
    <figure ref={figureRef} className={`group relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-[#e9ebef] focus-within:ring-2 focus-within:ring-primary/35 ${layout === "hero" ? "xl:aspect-[16/10]" : "xl:aspect-square"}`}>
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
        className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.16)]"
        style={{ left: `${position}%` }}
        aria-hidden
      >
        <span className="absolute left-1/2 top-1/2 flex h-14 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] bg-white text-[#342d27] shadow-[0_6px_20px_rgba(0,0,0,0.18)] sm:h-12 sm:w-9">
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
        data-before-after-touch-area
        className="absolute inset-x-0 top-1/2 z-30 h-24 -translate-y-1/2 cursor-col-resize touch-pan-y select-none sm:h-20"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointerGesture(event)}
        onPointerCancel={(event) => finishPointerGesture(event, true)}
        onLostPointerCapture={() => {
          gestureRef.current = null;
        }}
        aria-hidden
      />
    </figure>
  );
};

export default BeforeAfterComparison;
