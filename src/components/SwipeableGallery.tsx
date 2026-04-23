import { useRef, useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwipeableGalleryProps {
  images: string[];
  alt: string;
  height?: string;
  /** Per-image fit. "contain" — фото показывается целиком. По умолчанию "cover". */
  fits?: ("cover" | "contain")[];
  /** Per-image object-position (CSS), например "left center" — для широких фото. По умолчанию "center". */
  objectPositions?: (string | undefined)[];
  /** Включить blur-фон под фото с fit="contain". true для всех или массив per-image. По умолчанию false. */
  blurBackground?: boolean | boolean[];
  /** Бесшовное продолжение краёв (растянутая полоска + маска вместо обычного blur). true для всех или массив. */
  edgeBleed?: boolean | boolean[];
  children?: React.ReactNode;
}

const SWIPE_THRESHOLD_RATIO = 0.18; // 18% ширины — чтобы засчитать смену слайда
const SWIPE_VELOCITY = 0.45; // px/ms — быстрый флик тоже листает

const SwipeableGallery = ({ images, alt, height = "h-[200px]", fits, objectPositions, blurBackground = false, edgeBleed = false, children }: SwipeableGalleryProps) => {
  const blurAt = (i: number) => Array.isArray(blurBackground) ? !!blurBackground[i] : !!blurBackground;
  const edgeAt = (i: number) => Array.isArray(edgeBleed) ? !!edgeBleed[i] : !!edgeBleed;
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
      className={`relative ${height} overflow-hidden select-none rounded-[14px] bg-muted`}
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
            const showEdge = edgeAt(i) && fit === "contain";
            const showBlur = !showEdge && blurAt(i) && fit === "contain";
            return (
              <div
                key={i}
                className="relative h-full flex-shrink-0 overflow-hidden bg-muted"
                style={{ width: `${100 / count}%` }}
              >
                {showBlur && (
                  <>
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      style={{ filter: "blur(16px)", transform: "scale(1.08)" }}
                      loading="eager"
                      decoding="sync"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </>
                )}
                {showEdge && (
                  <>
                    <div
                      className="absolute pointer-events-none z-10"
                      style={{
                        top: "-2%",
                        left: "-4%",
                        right: "-4%",
                        height: "32%",
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top center",
                        backgroundSize: "108% 5000%",
                        filter: "blur(14px)",
                        WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
                        maskImage: "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
                      }}
                    />
                    <div
                      className="absolute pointer-events-none z-10"
                      style={{
                        bottom: "-2%",
                        left: "-4%",
                        right: "-4%",
                        height: "32%",
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "108% 5000%",
                        filter: "blur(14px)",
                        WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 55%, transparent 100%)",
                        maskImage: "linear-gradient(to top, #000 0%, #000 55%, transparent 100%)",
                      }}
                    />
                  </>
                )}
                <img
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  className={`relative w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"} pointer-events-none`}
                  style={objectPositions?.[i] ? { objectPosition: objectPositions[i] } : undefined}
                  loading={blurAt(i) || edgeAt(i) || Math.abs(i - current) <= 1 ? "eager" : "lazy"}
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
          const isActive = i === current;
          const showEdge = edgeAt(i) && fit === "contain" && isActive;
          const showBlur = !showEdge && blurAt(i) && fit === "contain" && isActive;
          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden bg-muted"
              style={{ zIndex: isActive ? 2 : 1, opacity: isActive ? 1 : 0 }}
            >
              {showBlur && (
                <>
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "blur(16px)", transform: "scale(1.08)" }}
                    loading="eager"
                    decoding="sync"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </>
              )}
              {showEdge && (
                <>
                  <div
                    className="absolute pointer-events-none z-10"
                    style={{
                      top: "-2%",
                      left: "-4%",
                      right: "-4%",
                      height: "26%",
                      backgroundImage: `url(${src})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "top center",
                      backgroundSize: "108% 5000%",
                      filter: "blur(10px)",
                    }}
                  />
                  <div
                    className="absolute pointer-events-none z-10"
                    style={{
                      bottom: "-2%",
                      left: "-4%",
                      right: "-4%",
                      height: "26%",
                      backgroundImage: `url(${src})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "bottom center",
                      backgroundSize: "108% 5000%",
                      filter: "blur(10px)",
                    }}
                  />
                </>
              )}
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className={`relative w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
                style={objectPositions?.[i] ? { objectPosition: objectPositions[i] } : undefined}
                loading={isActive ? "eager" : "lazy"}
                decoding="sync"
                draggable={false}
              />
            </div>
          );
        })
      )}
      <div className="absolute inset-0 z-10 pointer-events-none [&>*]:pointer-events-auto">{children}</div>
      {count > 1 && (() => {
        const MAX_VISIBLE = 5;
        const DOT = 3; // px
        const GAP = 2; // px
        const STEP = DOT + GAP;
        const visible = Math.min(count, MAX_VISIBLE);
        const trackWidth = visible * DOT + (visible - 1) * GAP;

        // Активная точка должна оставаться по центру окна (когда возможно).
        // window = индекс самой левой видимой точки.
        const half = Math.floor(MAX_VISIBLE / 2);
        let windowStart = 0;
        if (count > MAX_VISIBLE) {
          windowStart = Math.max(0, Math.min(current - half, count - MAX_VISIBLE));
        }
        const offset = -windowStart * STEP;

        return (
          <div
            className="absolute bottom-[6px] right-[6px] z-10 rounded-full bg-foreground/40 px-[5px] py-[3px] flex items-center"
            style={{ width: trackWidth + 10 /* px-[5px]*2 */ }}
          >
            <div className="relative flex items-center overflow-hidden" style={{ width: trackWidth, height: DOT }}>
              <div
                className="absolute top-0 left-0 flex items-center transition-transform duration-300 ease-out"
                style={{ gap: `${GAP}px`, transform: `translateX(${offset}px)` }}
              >
                {images.map((_, i) => {
                  const posInWindow = i - windowStart;
                  // Уменьшаем крайние точки только когда есть скрытые с этой стороны
                  const hiddenLeft = windowStart > 0;
                  const hiddenRight = windowStart + MAX_VISIBLE < count;
                  let scale = 1;
                  if (hiddenLeft && posInWindow === 0) scale = 0.5;
                  else if (hiddenLeft && posInWindow === 1) scale = 0.75;
                  else if (hiddenRight && posInWindow === MAX_VISIBLE - 1) scale = 0.5;
                  else if (hiddenRight && posInWindow === MAX_VISIBLE - 2) scale = 0.75;

                  return (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-200 ${i === current ? "bg-white" : "bg-white/50"}`}
                      style={{
                        width: `${DOT}px`,
                        height: `${DOT}px`,
                        transform: `scale(${scale})`,
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SwipeableGallery;
