import { useRef, useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwipeableGalleryProps {
  images: string[];
  alt: string;
  height?: string;
  /** Per-image fit. "contain" — фото показывается целиком с blur-фоном. По умолчанию "cover". */
  fits?: ("cover" | "contain")[];
  children?: React.ReactNode;
}

const SWIPE_THRESHOLD_RATIO = 0.18; // 18% ширины — чтобы засчитать смену слайда
const SWIPE_VELOCITY = 0.45; // px/ms — быстрый флик тоже листает

const SwipeableGallery = ({ images, alt, height = "h-[200px]", fits, children }: SwipeableGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const lockedAxis = useRef<"x" | "y" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const count = images.length;

  const width = containerRef.current?.clientWidth ?? 1;

  const settle = useCallback((deltaX: number, elapsed: number) => {
    const w = containerRef.current?.clientWidth ?? 1;
    const velocity = Math.abs(deltaX) / Math.max(elapsed, 1);
    const passedThreshold = Math.abs(deltaX) > w * SWIPE_THRESHOLD_RATIO;
    const fastSwipe = velocity > SWIPE_VELOCITY && Math.abs(deltaX) > 10;
    if (passedThreshold || fastSwipe) {
      setCurrent((c) => {
        if (deltaX < 0) return Math.min(c + 1, count - 1);
        return Math.max(c - 1, 0);
      });
    }
    setDragX(0);
    setIsDragging(false);
    lockedAxis.current = null;
  }, [count]);

  // Нативные non-passive listeners — нужны чтобы preventDefault блокировал
  // вертикальный скролл во время горизонтального свайпа (без дёрганья страницы).
  useEffect(() => {
    if (!isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const handleStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      startTime.current = performance.now();
      lockedAxis.current = null;
      setIsDragging(true);
    };

    const handleMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (!lockedAxis.current) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        } else {
          return;
        }
      }
      if (lockedAxis.current === "x") {
        if (e.cancelable) e.preventDefault();
        let resisted = dx;
        if ((current === 0 && dx > 0) || (current === count - 1 && dx < 0)) {
          resisted = dx * 0.35;
        }
        setDragX(resisted);
      } else {
        setDragX(0);
      }
    };

    const handleEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX.current;
      const elapsed = performance.now() - startTime.current;
      if (lockedAxis.current === "x") {
        settle(dx, elapsed);
      } else {
        setDragX(0);
        setIsDragging(false);
        lockedAxis.current = null;
      }
    };

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: false });
    el.addEventListener("touchend", handleEnd, { passive: true });
    el.addEventListener("touchcancel", handleEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
      el.removeEventListener("touchcancel", handleEnd);
    };
  }, [isMobile, current, count, settle]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isMobile || count <= 1) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const idx = Math.min(Math.floor((x / rect.width) * count), count - 1);
    setCurrent(idx);
  };

  const onMouseLeave = () => {
    if (!isMobile) setCurrent(0);
  };

  // Сброс drag при смене слайда (на случай rapid swipe)
  useEffect(() => {
    if (!isDragging) setDragX(0);
  }, [current, isDragging]);

  const translatePct = isMobile
    ? `calc(${-current * 100}% / ${count} + ${dragX}px)`
    : `${-current * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`relative ${height} overflow-hidden select-none rounded-[14px]`}
      onMouseMove={!isMobile ? onMouseMove : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {isMobile ? (
        <div
          className={`flex h-full ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
          style={{
            transform: `translate3d(${translatePct}, 0, 0)`,
            width: `${count * 100}%`,
            willChange: "transform",
          }}
        >
          {images.map((src, i) => {
            const fit = fits?.[i] ?? "cover";
            return (
              <div
                key={i}
                className={`relative isolate h-full flex-shrink-0 overflow-hidden ${fit === "contain" ? "" : "bg-muted"}`}
                style={{ width: `${100 / count}%` }}
              >
                {fit === "contain" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 z-0 blur-2xl pointer-events-none"
                    style={{
                      backgroundImage: `url(${src})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      transform: "translateZ(0) scale(1.4)",
                    }}
                  />
                )}
                <img
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  className={`relative z-10 w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"} pointer-events-none`}
                  loading={i === 0 || fit === "contain" ? "eager" : "lazy"}
                  decoding="sync"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      ) : (
        images.map((src, i) => {
          const fit = fits?.[i] ?? "cover";
          return (
            <div
              key={i}
              className={`absolute inset-0 isolate overflow-hidden ${fit === "contain" ? "" : "bg-muted"}`}
              style={{ zIndex: i === current ? 1 : 0, opacity: i === current ? 1 : 0 }}
            >
              {fit === "contain" && (
                <div
                  aria-hidden
                  className="absolute inset-0 z-0 blur-2xl pointer-events-none"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    transform: "translateZ(0) scale(1.4)",
                  }}
                />
              )}
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className={`relative z-10 w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
                loading="eager"
                decoding="sync"
                draggable={false}
              />
            </div>
          );
        })
      )}
      <div className="absolute inset-0 z-10 pointer-events-none [&>*]:pointer-events-auto">{children}</div>
      {count > 1 && (
        <div className="absolute bottom-[6px] right-[6px] z-10 bg-foreground/40 backdrop-blur-md rounded-full px-[5px] py-[3px] flex items-center gap-[2px]">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-[3px] h-[3px] rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeableGallery;
