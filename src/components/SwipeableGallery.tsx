import { useRef, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwipeableGalleryProps {
  images: string[];
  alt: string;
  height?: string;
  children?: React.ReactNode;
}

const SwipeableGallery = ({ images, alt, height = "h-[200px]", children }: SwipeableGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const hasMoved = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const count = images.length;

  // ── Mobile: touch swipe ──
  const handleEnd = useCallback((endX: number) => {
    const diff = startX.current - endX;
    if (Math.abs(diff) > 30) {
      hasMoved.current = true;
      setCurrent((c) => diff > 0 ? Math.min(c + 1, count - 1) : Math.max(c - 1, 0));
    }
  }, [count]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    hasMoved.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  // ── Desktop: Avito-style hover position ──
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

  return (
    <div
      ref={containerRef}
      className={`relative ${height} overflow-hidden select-none`}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      onMouseMove={!isMobile ? onMouseMove : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {/* Show only current image (no sliding on desktop for instant switch) */}
      {isMobile ? (
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)`, width: `${count * 100}%` }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${alt} ${i + 1}`}
              className="h-full object-cover flex-shrink-0"
              style={{ width: `${100 / count}%` }}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>
      ) : (
        /* Desktop: all images stacked, show current via z-index — instant switch */
        images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: i === current ? 1 : 0, opacity: i === current ? 1 : 0 }}
            loading="eager"
            draggable={false}
          />
        ))
      )}
      <div className="absolute inset-0 z-10 pointer-events-none [&>*]:pointer-events-auto">{children}</div>
      {/* Dots */}
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
