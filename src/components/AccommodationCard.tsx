import { ExternalLink, MapPin, Banknote } from 'lucide-react';
import type { Accommodation } from '../types';
import { trackEvent } from '../utils/analytics';

interface AccommodationCardProps {
  accommodation: Accommodation;
  marathonEventId: string;
}

export default function AccommodationCard({ accommodation, marathonEventId }: AccommodationCardProps) {
  const handleClick = () => {
    trackEvent({
      eventType: 'click_accommodation',
      accommodationId: accommodation.id,
      marathonEventId,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-navy-300 hover:shadow-md transition-all">
      <h4 className="font-bold text-navy-800 text-lg mb-3">{accommodation.areaName}</h4>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <span>{accommodation.distanceToVenue}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Banknote size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <span>{accommodation.priceRange}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{accommodation.description}</p>

      <div className="flex flex-wrap gap-2">
        <a
          href={accommodation.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <ExternalLink size={14} />
          宿泊候補を見る
        </a>
        {accommodation.rakutenTravelUrl && (
          <a
            href={accommodation.rakutenTravelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            楽天トラベルで探す
          </a>
        )}
      </div>
    </div>
  );
}
