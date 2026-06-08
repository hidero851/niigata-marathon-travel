import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  items: React.ReactNode[];
  interval?: number;
  pcVisible?: number;
  spVisible?: number;
  showDots?: boolean;
};

export default function AutoScrollCarousel({
  items,
  interval = 4500,
  pcVisible = 3,
  spVisible = 1.15,
  showDots = true,
}: Props) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slotWidth, setSlotWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const len = items.length;

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      const visible = isMobile ? spVisible : pcVisible;
      setSlotWidth(cw / visible);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [pcVisible, spVisible]);

  const cloned = [...items, ...items];

  const advance = useCallback(() => setIndex((prev) => prev + 1), []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(advance, interval);
  }, [advance, interval]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // 末尾に達したらアニメなしで先頭にリセット
  useEffect(() => {
    if (index < len) return;
    const t = setTimeout(() => {
      setAnimated(false);
      setIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    }, 500);
    return () => clearTimeout(t);
  }, [index, len]);

  const GAP = 16;
  const cardWidth = slotWidth - GAP;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopTimer();
      if (diff > 0) {
        setIndex((prev) => prev + 1);
      } else {
        setIndex((prev) => Math.max(0, prev - 1));
      }
      startTimer();
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${-(index * slotWidth)}px)`,
            transition: animated ? 'transform 0.5s ease' : 'none',
          }}
        >
          {cloned.map((item, i) => (
            <div key={i} style={{ width: `${cardWidth}px`, flexShrink: 0 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {showDots && (
        <div className="flex justify-center gap-1.5 mt-5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { stopTimer(); setIndex(i); startTimer(); }}
              className={`w-2 h-2 rounded-full transition-colors ${
                (index % len) === i ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
