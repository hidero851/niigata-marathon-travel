import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import type { LocalProduct } from '../types';
import GradientImage from './GradientImage';
import { trackEvent } from '../utils/analytics';
import { getProductVisualSetting } from '../utils/adminSettings';

interface ProductCardProps {
  product: LocalProduct;
  marathonEventId?: string;
  compact?: boolean;
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1e3a5f, #0d2d6b)';

export default function ProductCard({ product, marathonEventId, compact = false }: ProductCardProps) {
  const navigate = useNavigate();
  const visualSetting = getProductVisualSetting(product.id);
  const displayImageUrl = visualSetting?.imageUrl || product.imageUrl;
  const displayShortDescription = visualSetting?.shortDescription || product.shortDescription;

  const handleClick = () => {
    trackEvent({ eventType: 'click_product', productId: product.id, marathonEventId });
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="card cursor-pointer group" onClick={handleClick}>
      {displayImageUrl ? (
        <div
          className={`${compact ? 'h-32' : 'h-40'} bg-cover bg-center bg-no-repeat`}
          style={{
            backgroundImage: `url("${displayImageUrl}"), ${product.imageGradient ?? DEFAULT_GRADIENT}`,
          }}
        />
      ) : (
        <GradientImage
          gradient={product.imageGradient}
          name={product.name}
          height={compact ? 'h-32' : 'h-40'}
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <MapPin size={11} />
          {product.area}
        </div>

        <h4 className="font-bold text-navy-800 mb-1 group-hover:text-blue-700 transition-colors leading-snug">
          {product.name}
        </h4>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
          {displayShortDescription}
        </p>

        <button className="flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
          詳しく見る
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
