export interface GeocodedLocation {
  name: string;
  lat: number;
  lon: number;
}

const cache = new Map<string, GeocodedLocation | null>();
let lastRequestAt = 0;

function wait(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    const abort = () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal.addEventListener('abort', abort, { once: true });
  });
}

export async function geocodeLocation(query: string, signal: AbortSignal): Promise<GeocodedLocation | null> {
  const cleanedQuery = query.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const cacheKey = cleanedQuery.toLocaleLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const waitTime = Math.max(0, 1000 - (Date.now() - lastRequestAt));
  if (waitTime > 0) await wait(waitTime, signal);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

  lastRequestAt = Date.now();
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', cleanedQuery);

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`OpenStreetMap search returned HTTP ${response.status}`);
  }

  const results: { display_name: string; lat: string; lon: string }[] = await response.json();
  const result = results[0];
  if (!result) {
    cache.set(cacheKey, null);
    return null;
  }

  const location = {
    name: result.display_name,
    lat: Number(result.lat),
    lon: Number(result.lon),
  };
  if (!Number.isFinite(location.lat) || !Number.isFinite(location.lon)) {
    throw new Error('OpenStreetMap returned invalid coordinates');
  }

  cache.set(cacheKey, location);
  return location;
}
