import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  items: React.ReactNode[];
  interval?: number;
  pcVisible?: number;
};

/**
 * 注目の大会用カルーセル（JS制御・無限ループ・ドット付き）
 * PC: pcVisible 枚表示、スマホ: 1.15枚表示（次カードをちら見せ）
 */
export default function AutoScrollCarousel({ items, interval = 4500, pcVisible = 3 }: Props) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slotWidth, setSlotWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const len = items.length;

  // コンテナ幅からスロット幅を計算（レスポンシブ対応）
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      const visible = isMobile ? 1.15 : pcVisible;
      setSlotWidth(cw / visible);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [pcVisible]);

  const cloned = [...items, ...items]; // 末尾に複製してシームレスループ

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

  // len に達したらアニメなしで 0 にリセット
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

  return (
    <div className="relative">
      {/* カード列 */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
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

      {/* ドットインジケーター */}
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
    </div>
  );
}
