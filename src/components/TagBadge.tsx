type TagColor = 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'pink' | 'gray';

const TAG_COLORS: Record<string, TagColor> = {
  '日本海グルメ': 'teal',
  '温泉': 'orange',
  '地酒': 'purple',
  '米どころ': 'green',
  '城下町': 'blue',
  '紅葉': 'orange',
  '雪景色': 'blue',
  '佐渡': 'teal',
  '絶景': 'blue',
  '桜': 'pink',
  '自然': 'green',
  'グルメ': 'orange',
  '家族向け': 'green',
  '離島': 'teal',
  '都市型': 'blue',
  '初心者向け': 'green',
  '山岳': 'green',
  '海岸': 'teal',
  '潮風': 'teal',
};

const COLOR_CLASSES: Record<TagColor, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-emerald-100 text-emerald-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  teal: 'bg-teal-100 text-teal-800',
  pink: 'bg-pink-100 text-pink-800',
  gray: 'bg-gray-100 text-gray-700',
};

interface TagBadgeProps {
  tag: string;
  size?: 'sm' | 'md';
}

export default function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const color = TAG_COLORS[tag] ?? 'gray';
  const colorClass = COLOR_CLASSES[color];
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {tag}
    </span>
  );
}
