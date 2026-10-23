const CATEGORY_FALLBACKS = {
  architecture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  view: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  art: 'https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?auto=format&fit=crop&w=1200&q=80',
  photo: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80';

export function getCategoryFallback(category) {
  return CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACK;
}

export function handleImageFallback(e, category) {
  if (!e || !e.target) return;
  // Prevent infinite loop if fallback itself fails
  e.target.onerror = null;
  e.target.src = getCategoryFallback(category);
}

export function getSafeImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Strip any leading slashes or dot-slashes to avoid double slashes (.//)
  const clean = path.replace(/^(\.\/|\/)+/, '');
  return `./${clean}`;
}
