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

export function locationSearchQueries(location: string): string[] {
  const cleaned = location
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = cleaned
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const queries = [cleaned];

  for (let firstPart = 1; parts.length - firstPart >= 2; firstPart++) {
    queries.push(parts.slice(firstPart).join(', '));
  }

  return Array.from(new Set(queries));
}

async function searchNominatim(query: string, signal: AbortSignal): Promise<GeocodedLocation | null> {
  const waitTime = Math.max(0, 1000 - (Date.now() - lastRequestAt));
  if (waitTime > 0) await wait(waitTime, signal);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

  lastRequestAt = Date.now();
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', query);

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`OpenStreetMap search returned HTTP ${response.status}`);
  }

  const results: { display_name: string; lat: string; lon: string }[] = await response.json();
  const result = results[0];
  if (!result) return null;

  const location = {
    name: result.display_name,
    lat: Number(result.lat),
    lon: Number(result.lon),
  };
  if (!Number.isFinite(location.lat) || !Number.isFinite(location.lon)) {
    throw new Error('OpenStreetMap returned invalid coordinates');
  }
  return location;
}

export async function geocodeLocation(query: string, signal: AbortSignal): Promise<GeocodedLocation | null> {
  const queries = locationSearchQueries(query);
  const cacheKey = queries[0].toLocaleLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  for (const candidate of queries) {
    const location = await searchNominatim(candidate, signal);
    if (location) {
      cache.set(cacheKey, location);
      return location;
    }
  }

  cache.set(cacheKey, null);
  return null;
}
