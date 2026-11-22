export type Mode = 'and' | 'or';

export type ListColumn =
  | 'genres'
  | 'languages'
  | 'countries_origin'
  | 'filming_locations'
  | 'directors'
  | 'stars'
  | 'writers'
  | 'production_companies'
  | 'mpa';

export const LIST_COLUMN_LABELS: Record<ListColumn, string> = {
  genres: 'Genres',
  languages: 'Languages',
  countries_origin: 'Countries',
  filming_locations: 'Filming locations',
  directors: 'Directors',
  stars: 'Stars',
  writers: 'Writers',
  production_companies: 'Production companies',
  mpa: 'Rating (MPA)',
};

export interface ListFilter {
  id: number;
  column: ListColumn;
  // 'or' matches movies having any selected value, 'and' requires all of them
  mode: Mode;
  values: string[];
}

export interface Criteria {
  title: string;
  minRating: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  lists: ListFilter[];
  // how the active filters are combined with each other
  combine: Mode;
}

export interface MovieTable {
  count: number;
  id: string[];
  title: string[];
  titleLower: string[];
  link: string[];
  duration: (string | null)[];
  minutes: (number | null)[];
  rating: (number | null)[];
  votes: number[];
  // votes × rating, so well-rated films with many votes rank above obscure ones with a few
  score: (number | null)[];
  year: (number | null)[];
  // filming location as written in the dataset, notes included; null until the column is loaded
  locations: string[] | null;
  lists: Partial<Record<ListColumn, string[][]>>;
}

export type RawColumns = Record<string, ArrayLike<any>>;

export const EMPTY_CRITERIA: Criteria = {
  title: '',
  minRating: null,
  yearFrom: null,
  yearTo: null,
  lists: [],
  combine: 'and',
};

// Columns that are cheap enough to load up front. The other list columns
// (cast, writers, production companies) are fetched when a filter needs them.
export const BASE_COLUMNS = [
  'id',
  'title',
  'duration',
  'mpa',
  'rating',
  'votes',
  'release_date',
  'movie_link',
  'genres',
  'languages',
  'countries_origin',
  'filming_locations',
  'directors',
];

/**
 * Parses the python-repr lists stored as text in the dataset,
 * e.g. "['Drama', 'Musical']" or `["George More O'Ferrall"]`.
 */
export function parseList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const s = raw.trim();
  if (s[0] !== '[') return s ? [s] : [];

  const out: string[] = [];
  let i = 1;
  while (i < s.length) {
    const quote = s[i];
    if (quote !== "'" && quote !== '"') {
      i++;
      continue;
    }
    let value = '';
    i++;
    while (i < s.length && s[i] !== quote) {
      if (s[i] === '\\' && i + 1 < s.length) i++;
      value += s[i];
      i++;
    }
    out.push(value);
    i++;
  }
  return out;
}

/** "301" -> 301, "9.5K" -> 9500, "1.2M" -> 1200000 */
export function parseVotes(raw: string | null | undefined): number {
  if (!raw) return 0;
  const m = /^([\d.,]+)\s*([KM]?)$/i.exec(raw.trim());
  if (!m) return 0;
  const n = parseFloat(m[1].replace(/,/g, ''));
  const unit = m[2].toUpperCase();
  return Math.round(n * (unit === 'K' ? 1e3 : unit === 'M' ? 1e6 : 1));
}

/** "1h 50m" -> 110, "2h" -> 120, "45m" -> 45. Anything else (some rows hold an MPA rating here) -> null. */
export function parseDuration(raw: string | null | undefined): number | null {
  const m = raw ? /^(?:(\d+)h)?\s*(?:(\d+)m)?$/.exec(raw.trim()) : null;
  if (!m || (m[1] == null && m[2] == null)) return null;
  return Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
}

function yearOf(value: unknown): number | null {
  if (value instanceof Date) return value.getUTCFullYear();
  if (typeof value === 'string' && /^\d{4}/.test(value)) return Number(value.slice(0, 4));
  return null;
}

/**
 * A filming location is a comma separated path from the most to the least specific place,
 * optionally followed by a note: "Los Angeles, California, USA (location)".
 * Returns the path and every parent of it so that a movie can be filtered by country,
 * state or city: ["Los Angeles, California, USA", "California, USA", "USA"].
 */
export function parseLocations(raw: string | null | undefined): string[] {
  const out = new Set<string>();
  for (const entry of parseList(raw)) {
    const parts = entry
      .replace(/\s*\([^)]*\)\s*$/, '')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    for (let i = 0; i < parts.length; i++) out.add(parts.slice(i).join(', '));
  }
  return Array.from(out);
}

function locationText(raw: ArrayLike<any>): string[] {
  return Array.from(raw, (value) => parseList(value).join('; '));
}

function listRows(column: ListColumn, raw: ArrayLike<any>): string[][] {
  const rows: string[][] = new Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    rows[i] =
      column === 'mpa'
        ? raw[i]
          ? [String(raw[i])]
          : []
        : column === 'filming_locations'
          ? parseLocations(raw[i])
          : parseList(raw[i]);
  }
  return rows;
}

export function buildTable(count: number, raw: RawColumns): MovieTable {
  const title: string[] = new Array(count);
  const votes: number[] = new Array(count);
  const year: (number | null)[] = new Array(count);
  const rating: (number | null)[] = new Array(count);
  for (let i = 0; i < count; i++) {
    title[i] = raw.title[i] ?? '';
    votes[i] = parseVotes(raw.votes[i]);
    year[i] = yearOf(raw.release_date[i]);
    rating[i] = raw.rating[i] == null ? null : Number(raw.rating[i]);
  }

  const table: MovieTable = {
    count,
    id: Array.from(raw.id),
    title,
    titleLower: title.map((t) => t.toLowerCase()),
    link: Array.from(raw.movie_link, (l) => l ?? ''),
    duration: Array.from(raw.duration, (d) => d ?? null),
    minutes: Array.from(raw.duration, parseDuration),
    rating,
    votes,
    score: rating.map((r, i) => (r == null || votes[i] === 0 ? null : r * votes[i])),
    year,
    locations: raw.filming_locations ? locationText(raw.filming_locations) : null,
    lists: {},
  };
  for (const column of Object.keys(LIST_COLUMN_LABELS) as ListColumn[]) {
    if (raw[column]) table.lists[column] = listRows(column, raw[column]);
  }
  return table;
}

export function addListColumn(table: MovieTable, column: ListColumn, raw: ArrayLike<any>): MovieTable {
  return {
    ...table,
    locations: column === 'filming_locations' ? locationText(raw) : table.locations,
    lists: { ...table.lists, [column]: listRows(column, raw) },
  };
}

function matchesList(values: string[], row: string[], mode: Mode): boolean {
  return mode === 'and'
    ? values.every((v) => row.includes(v))
    : values.some((v) => row.includes(v));
}

/** Returns the indexes of the rows matching the criteria. */
export function filterMovies(table: MovieTable, criteria: Criteria): number[] {
  const checks: ((i: number) => boolean)[] = [];

  const title = criteria.title.trim().toLowerCase();
  if (title) checks.push((i) => table.titleLower[i].includes(title));

  const { minRating, yearFrom, yearTo } = criteria;
  if (minRating != null) {
    checks.push((i) => table.rating[i] != null && table.rating[i] >= minRating);
  }
  if (yearFrom != null) checks.push((i) => table.year[i] != null && table.year[i] >= yearFrom);
  if (yearTo != null) checks.push((i) => table.year[i] != null && table.year[i] <= yearTo);

  for (const filter of criteria.lists) {
    const rows = table.lists[filter.column];
    // a filter without values, or whose column is still loading, does not constrain anything
    if (!rows || filter.values.length === 0) continue;
    checks.push((i) => matchesList(filter.values, rows[i], filter.mode));
  }

  const out: number[] = [];
  for (let i = 0; i < table.count; i++) {
    if (
      checks.length === 0 ||
      (criteria.combine === 'and' ? checks.every((c) => c(i)) : checks.some((c) => c(i)))
    ) {
      out.push(i);
    }
  }
  return out;
}

export type SortKey =
  | 'title'
  | 'year'
  | 'rating'
  | 'votes'
  | 'score'
  | 'duration'
  | 'mpa'
  | 'genres'
  | 'directors'
  | 'stars'
  | 'filming_locations';

export type SortDir = 'asc' | 'desc';

export interface Sort {
  key: SortKey;
  dir: SortDir;
}

// the direction used the first time a column is clicked: biggest first for numbers, A-Z for text
export const DEFAULT_SORT_DIR: Record<SortKey, SortDir> = {
  title: 'asc',
  year: 'desc',
  rating: 'desc',
  votes: 'desc',
  score: 'desc',
  duration: 'desc',
  mpa: 'asc',
  genres: 'asc',
  directors: 'asc',
  stars: 'asc',
  filming_locations: 'asc',
};

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

function sortValue(table: MovieTable, key: SortKey, i: number): string | number | null {
  switch (key) {
    case 'title':
      return table.title[i];
    case 'year':
      return table.year[i];
    case 'rating':
      return table.rating[i];
    case 'votes':
      return table.votes[i] || null;
    case 'score':
      return table.score[i];
    case 'duration':
      return table.minutes[i];
    case 'filming_locations':
      return table.locations?.[i] || null;
    default: {
      const row = table.lists[key]?.[i];
      return row && row.length > 0 ? row.join(', ') : null;
    }
  }
}

/**
 * Sorts row indexes by a column. Rows without a value always come last, in either direction,
 * and ties are broken by the number of votes (most voted first).
 */
export function sortIndexes(table: MovieTable, indexes: number[], { key, dir }: Sort): number[] {
  const sign = dir === 'asc' ? 1 : -1;
  const keyed = indexes.map((i) => ({ i, v: sortValue(table, key, i) }));
  keyed.sort((a, b) => {
    if (a.v == null || b.v == null) {
      if (a.v != null || b.v != null) return a.v == null ? 1 : -1;
    } else {
      const order = typeof a.v === 'number' ? a.v - (b.v as number) : collator.compare(a.v, b.v as string);
      if (order !== 0) return order * sign;
    }
    return table.votes[b.i] - table.votes[a.i];
  });
  return keyed.map((k) => k.i);
}

export interface FacetOption {
  value: string;
  lower: string;
  count: number;
}

/** Distinct values of a list column with the number of movies having each, most common first. */
export function facetOptions(rows: string[][]): FacetOption[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const value of row) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([value, count]) => ({ value, lower: value.toLowerCase(), count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value)
  );
}

export function suggest(options: FacetOption[], query: string, exclude: string[], limit = 20): FacetOption[] {
  const q = query.trim().toLowerCase();
  const out: FacetOption[] = [];
  for (const option of options) {
    if (out.length >= limit) break;
    if (exclude.includes(option.value)) continue;
    if (!q || option.lower.includes(q)) out.push(option);
  }
  return out;
}
