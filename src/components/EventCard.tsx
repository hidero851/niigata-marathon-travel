import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import type { MarathonEvent } from '../types';
import TagBadge from './TagBadge';
import { trackEvent } from '../utils/analytics';
import { trackGA4 } from '../utils/ga4';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #0d2d6b)';

function buildBgImage(imageUrl: string, fallback: string): string {
  const alt = imageUrl.endsWith('.png')
    ? imageUrl.replace('.png', '.jpg')
    : imageUrl.replace(/\.jpe?g$/, '.png');
  return `url("${imageUrl}"), url("${alt}"), ${fallback}`;
}

interface EventCardProps {
  event: MarathonEvent;
  source?: 'featured' | 'list';
}

export default function EventCard({ event, source }: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    trackEvent({ eventType: 'click_event_detail', marathonEventId: event.id });
    trackGA4(source === 'featured' ? 'click_featured_event' : 'click_event_list', {
      event_id: event.id,
      event_name: event.name,
    });
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      className="card cursor-pointer group"
      onClick={handleClick}
    >
      <div
        className="h-48 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: event.heroImageUrl
            ? buildBgImage(event.heroImageUrl, event.imageGradient ?? DEFAULT_GRADIENT)
            : event.imageGradient ?? DEFAULT_GRADIENT,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {event.date}
          </span>
        </div>

        <h3 className="text-lg font-bold text-navy-800 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
          {event.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
          {event.catchCopy}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {event.distances.map((d) => (
            <span key={d} className="text-xs bg-navy-50 text-navy-700 border border-navy-200 px-2 py-0.5 rounded-full">
              {d}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex items-center justify-end">
          <button className="flex items-center gap-1 text-sm font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
            大会と旅を見る
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
