const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #0d2d6b)';

interface GradientImageProps {
  gradient?: string;
  name: string;
  tags?: string[];
  height?: string;
}

const TAG_ICONS: Record<string, string> = {
  '佐渡': '🏝️',
  '桜': '🌸',
  '紅葉': '🍂',
  '温泉': '♨️',
  '絶景': '🌊',
  '雪景色': '❄️',
  '城下町': '🏯',
  '日本海グルメ': '🐟',
  '米どころ': '🌾',
  '地酒': '🍶',
  '山岳': '⛰️',
  '離島': '🏝️',
};

function getIcon(tags?: string[]): string {
  if (!tags) return '🏃';
  for (const tag of tags) {
    if (TAG_ICONS[tag]) return TAG_ICONS[tag];
  }
  return '🏃';
}

export default function GradientImage({ gradient, name, tags, height = 'h-52' }: GradientImageProps) {
  const icon = getIcon(tags);
  const bg = gradient ?? DEFAULT_GRADIENT;

  return (
    <div
      className={`${height} relative flex flex-col items-center justify-center select-none`}
      style={{ background: bg }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
      <div className="relative text-center text-white drop-shadow-lg">
        <div className="text-6xl mb-3">{icon}</div>
        <div className="text-sm font-semibold opacity-90 px-4 leading-tight">{name}</div>
      </div>
    </div>
  );
}
