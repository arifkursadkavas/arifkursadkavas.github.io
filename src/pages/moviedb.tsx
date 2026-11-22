import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

import ValuePicker from '../components/ValuePicker';
import Seo from '../components/Seo';
import {
  BASE_COLUMNS,
  Criteria,
  DEFAULT_SORT_DIR,
  EMPTY_CRITERIA,
  FacetOption,
  LIST_COLUMN_LABELS,
  ListColumn,
  ListFilter,
  Mode,
  MovieTable,
  Sort,
  SortKey,
  addListColumn,
  buildTable,
  facetOptions,
  filterMovies,
  sortIndexes,
} from '../lib/movies';
import {
  fetchMovieCast,
  fetchMovieDetails,
  MoviesSource,
  openMovies,
  readColumns,
} from '../lib/moviesParquet';

const LocationMap = dynamic(() => import('../components/LocationMap'), { ssr: false });

const PAGE_SIZE = 50;

// the stars and location filters are shown from the start; without values they do not constrain anything
const DEFAULT_CRITERIA: Criteria = {
  ...EMPTY_CRITERIA,
  lists: [
    { id: 0, column: 'stars', mode: 'or', values: [] },
    { id: 1, column: 'filming_locations', mode: 'or', values: [] },
  ],
};

const DEFAULT_SORT: Sort = { key: 'score', dir: 'desc' };

const TABLE_COLUMNS: { key: SortKey; label: string; hint?: string; numeric?: boolean }[] = [
  { key: 'title', label: 'Title' },
  { key: 'year', label: 'Year', numeric: true },
  { key: 'rating', label: 'Rating', numeric: true },
  { key: 'votes', label: 'Votes', numeric: true },
  { key: 'score', label: 'Score', hint: 'Votes × rating', numeric: true },
  { key: 'duration', label: 'Length', numeric: true },
  { key: 'mpa', label: 'MPA' },
  { key: 'genres', label: 'Genres' },
  { key: 'directors', label: 'Directors' },
  { key: 'stars', label: 'Cast' },
  { key: 'filming_locations', label: 'Filming location' },
];

const ratingTier = (rating: number) => (rating >= 8 ? 'high' : rating >= 6.5 ? 'mid' : 'low');

// long lists are clamped by the stylesheet, the tooltip keeps the full text reachable
const longText = (text: string | undefined) =>
  text ? (
    <div className='mdbClamp' title={text}>
      {text}
    </div>
  ) : null;

const pending = <span className='mdbPending'>…</span>;

function renderCell(t: MovieTable, key: SortKey, i: number): React.ReactNode {
  switch (key) {
    case 'title':
      return (
        <a className='mdbTitle' href={t.link[i]} target='_blank' rel='noreferrer'>
          {t.title[i]}
        </a>
      );
    case 'year':
      return t.year[i];
    case 'rating': {
      const rating = t.rating[i];
      return rating == null ? null : <span className={`mdbRating ${ratingTier(rating)}`}>{rating}</span>;
    }
    case 'votes':
      return t.votes[i] ? t.votes[i].toLocaleString() : null;
    case 'score': {
      const score = t.score[i];
      return score == null ? null : Math.round(score).toLocaleString();
    }
    case 'duration':
      return t.minutes[i] != null ? t.duration[i] : null;
    case 'mpa': {
      const mpa = t.lists.mpa?.[i]?.[0];
      return mpa ? <span className='mdbMpa'>{mpa}</span> : null;
    }
    case 'genres': {
      const genres = t.lists.genres?.[i];
      return genres && genres.length > 0 ? (
        <div className='mdbTags'>
          {genres.map((genre, n) => (
            <span className='mdbTag' key={`${genre}:${n}`}>
              {genre}
            </span>
          ))}
        </div>
      ) : null;
    }
    case 'directors':
      return t.lists.directors ? longText(t.lists.directors[i]?.join(', ')) : pending;
    case 'stars':
      return t.lists.stars ? longText(t.lists.stars[i].join(', ')) : pending;
    case 'filming_locations':
      return t.locations?.[i] || null;
  }
}

const toNumber = (value: string): number | null => (value.trim() === '' ? null : Number(value));

const cellClass = (key: SortKey, numeric: boolean | undefined, sorted: boolean) =>
  [key === 'title' && 'isTitle', numeric && 'isNumeric', sorted && 'isSorted'].filter(Boolean).join(' ') ||
  undefined;

const Movies = () => {
  const [table, setTable] = useState<MovieTable | null>(null);
  const [error, setError] = useState('');
  const [detailsReady, setDetailsReady] = useState(false);
  const [criteria, setCriteria] = useState<Criteria>(DEFAULT_CRITERIA);
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [mapLocations, setMapLocations] = useState<string[] | null>(null);
  const [mapClosing, setMapClosing] = useState(false);
  const [mapAnchor, setMapAnchor] = useState<{ x: number; y: number } | null>(null);
  const [mapOrigin, setMapOrigin] = useState<{ x: number; y: number } | null>(null);
  const mapDialogRef = useRef<HTMLElement | null>(null);
  const mapCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (mapCloseTimer.current) clearTimeout(mapCloseTimer.current);
    },
    []
  );

  const openMap = (locations: string[], anchor: { x: number; y: number }) => {
    if (mapCloseTimer.current) clearTimeout(mapCloseTimer.current);
    mapCloseTimer.current = null;
    setMapClosing(false);
    setMapAnchor(anchor);
    setMapOrigin(null);
    setMapLocations(locations);
  };
  const finishClosingMap = () => {
    if (mapCloseTimer.current) clearTimeout(mapCloseTimer.current);
    mapCloseTimer.current = null;
    setMapLocations(null);
  };
  const closeMap = () => {
    setMapClosing(true);
    if (mapCloseTimer.current) clearTimeout(mapCloseTimer.current);
    mapCloseTimer.current = setTimeout(finishClosingMap, 220);
  };

  useLayoutEffect(() => {
    const dialog = mapDialogRef.current;
    if (!mapLocations || !mapAnchor || !dialog) return;

    const rect = dialog.getBoundingClientRect();
    setMapOrigin({
      x: Math.max(0, Math.min(100, ((mapAnchor.x - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((mapAnchor.y - rect.top) / rect.height) * 100)),
    });
  }, [mapAnchor, mapLocations]);

  const source = useRef<MoviesSource | null>(null);
  const pending = useRef(new Set<ListColumn>());
  const facetCache = useRef(new WeakMap<string[][], FacetOption[]>());
  const [options, setOptions] = useState<Partial<Record<ListColumn, FacetOption[]>>>({});
  const nextFilterId = useRef(DEFAULT_CRITERIA.lists.length);

  useEffect(() => {
    if (!mapLocations) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMap();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapLocations]);

  const ensureColumn = useCallback(async (column: ListColumn) => {
    if (!source.current || pending.current.has(column)) return;
    pending.current.add(column);
    try {
      const raw = await readColumns(source.current, [column]);
      setTable((table) => (table ? addListColumn(table, column, raw[column]) : table));
    } catch (e) {
      pending.current.delete(column);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const ensureFacetOptions = useCallback((column: ListColumn) => {
    const rows = table?.lists[column];
    if (!rows || options[column]) return;

    let facets = facetCache.current.get(rows);
    if (!facets) {
      facets = facetOptions(rows);
      facetCache.current.set(rows, facets);
    }
    setOptions((current) => ({ ...current, [column]: facets }));
  }, [options, table]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const src = await openMovies('/movies.parquet');
        const raw = await readColumns(src, BASE_COLUMNS);
        if (cancelled) return;
        source.current = src;
        setTable(buildTable(src.count, raw));
        const detailColumns = ['directors', 'filming_locations'] as const;
        const loadDetails = async (): Promise<boolean> => {
          detailColumns.forEach((column) => pending.current.add(column));
          try {
            const details = await fetchMovieDetails('/movie-details.json.gz', src.count);
            if (!cancelled) {
              setTable((table) =>
                table
                  ? detailColumns.reduce(
                      (updatedTable, column) => addListColumn(updatedTable, column, details[column]),
                      table
                    )
                  : table
              );
            }
            return true;
          } catch (e) {
            if (!cancelled) setError(e instanceof Error ? e.message : String(e));
            return false;
          } finally {
            detailColumns.forEach((column) => pending.current.delete(column));
          }
        };
        const loadCast = async (): Promise<boolean> => {
          pending.current.add('stars');
          try {
            const cast = await fetchMovieCast('/movie-cast.json.gz', src.count);
            if (!cancelled) setTable((table) => (table ? addListColumn(table, 'stars', cast) : table));
            return true;
          } catch (e) {
            if (!cancelled) setError(e instanceof Error ? e.message : String(e));
            return false;
          } finally {
            pending.current.delete('stars');
          }
        };
        void Promise.all([loadDetails(), loadCast()]).then((loaded) => {
          if (!cancelled && loaded.every(Boolean)) setDetailsReady(true);
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureColumn]);

  const update = (patch: Partial<Criteria>) => {
    setCriteria((c) => ({ ...c, ...patch }));
    setShown(PAGE_SIZE);
  };

  const updateFilter = (id: number, patch: Partial<ListFilter>) =>
    update({ lists: criteria.lists.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

  const addFilter = (column: ListColumn) => {
    update({
      lists: [...criteria.lists, { id: nextFilterId.current++, column, mode: 'or', values: [] }],
    });
    if (!table?.lists[column]) ensureColumn(column);
  };

  const toggleSort = (key: SortKey) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: DEFAULT_SORT_DIR[key] }
    );
    setShown(PAGE_SIZE);
  };

  const matches = useMemo(() => (table ? filterMovies(table, criteria) : []), [table, criteria]);
  const sorted = useMemo(
    () => (table ? sortIndexes(table, matches, sort) : []),
    [table, matches, sort]
  );

  const usedColumns = criteria.lists.map((f) => f.column);
  const availableColumns = (Object.keys(LIST_COLUMN_LABELS) as ListColumn[]).filter(
    (c) => !usedColumns.includes(c)
  );

  return (
    <div className='mdbPage'>
      <Seo
        title='Movie Database Browser | Search and Filter Movies'
        description='Explore a 107,000-title movie dataset. Search by title, rating, and year, or filter by genre, cast, and filming location.'
        path='/moviedb'
      />
      <h1>Movie Database Browser</h1>

      <div className='mdbWorkspace'>
        <aside className='mdbSidebar' aria-label='Movie search and filters'>
        <div className='mdbPanel'>
        <section className='mdbSection'>
          <h3 className='mdbHeading'>Search</h3>
          <div className='mdbSearch'>
            <label className='mdbField'>
              <span>Title</span>
              <input
                className='mdbInput'
                type='text'
                value={criteria.title}
                placeholder='contains…'
                onChange={(e) => update({ title: e.target.value })}
              />
            </label>
            <label className='mdbField'>
              <span>Year from</span>
              <input
                className='mdbInput'
                type='number'
                value={criteria.yearFrom ?? ''}
                onChange={(e) => update({ yearFrom: toNumber(e.target.value) })}
              />
            </label>
            <label className='mdbField'>
              <span>Year to</span>
              <input
                className='mdbInput'
                type='number'
                value={criteria.yearTo ?? ''}
                onChange={(e) => update({ yearTo: toNumber(e.target.value) })}
              />
            </label>
            <label className='mdbField'>
              <span>Min rating</span>
              <input
                className='mdbInput'
                type='number'
                min={0}
                max={10}
                step={0.1}
                value={criteria.minRating ?? ''}
                onChange={(e) => update({ minRating: toNumber(e.target.value) })}
              />
            </label>
          </div>
        </section>

        <section className='mdbSection'>
          <h3 className='mdbHeading'>Filters</h3>
          {criteria.lists.length === 0 && <div className='mdbHint'>No filters yet, add one below.</div>}
          {criteria.lists.map((filter) => {
            const label = LIST_COLUMN_LABELS[filter.column];
            return (
              <div className='mdbFilter' key={filter.id}>
                <span className='mdbFilterLabel'>{label}</span>
                <select
                  className='mdbSelect mdbMode'
                  aria-label={`${label} match mode`}
                  value={filter.mode}
                  onChange={(e) => updateFilter(filter.id, { mode: e.target.value as Mode })}
                >
                  <option value='or'>Any of (OR)</option>
                  <option value='and'>All of (AND)</option>
                </select>
                <ValuePicker
                  options={options[filter.column] ?? null}
                  optionsAvailable={Boolean(table?.lists[filter.column])}
                  selected={filter.values}
                  label={label}
                  placeholder={`Search ${label.toLowerCase()}…`}
                  onFocus={() => ensureFacetOptions(filter.column)}
                  onAdd={(value) => updateFilter(filter.id, { values: [...filter.values, value] })}
                  onRemove={(value) =>
                    updateFilter(filter.id, { values: filter.values.filter((v) => v !== value) })
                  }
                />
                <button
                  type='button'
                  className='mdbButton mdbIconButton'
                  aria-label={`Remove ${label} filter`}
                  title='Remove filter'
                  onClick={() => update({ lists: criteria.lists.filter((f) => f.id !== filter.id) })}
                >
                  ×
                </button>
              </div>
            );
          })}
        </section>

        <div className='mdbFooter'>
          <select
            className='mdbSelect mdbAdd'
            aria-label='Add filter'
            value=''
            disabled={availableColumns.length === 0}
            onChange={(e) => e.target.value && addFilter(e.target.value as ListColumn)}
          >
            <option value=''>+ Add filter…</option>
            {availableColumns.map((c) => (
              <option key={c} value={c}>
                {LIST_COLUMN_LABELS[c]}
              </option>
            ))}
          </select>
          <div className='mdbFooterRight'>
            <label className='mdbInline'>
              <span>Movies must match</span>
              <select
                className='mdbSelect'
                value={criteria.combine}
                onChange={(e) => update({ combine: e.target.value as Mode })}
              >
                <option value='and'>All filters (AND)</option>
                <option value='or'>Any filter (OR)</option>
              </select>
            </label>
            <button
              type='button'
              className='mdbButton'
              onClick={() => {
                setCriteria(DEFAULT_CRITERIA);
                setShown(PAGE_SIZE);
              }}
            >
              Reset
            </button>
          </div>
        </div>
        </div>
        </aside>

        <section className='mdbResults' aria-label='Movie results'>
          {table && detailsReady && (
            <div className='mdbStatus'>
              {error
                ? `Could not load movies: ${error}`
                : `${matches.length.toLocaleString()} of ${table.count.toLocaleString()} movies`}
            </div>
          )}

          {!table || !detailsReady ? (
            error ? (
              <div className='mdbTableError' role='alert'>
                Could not load movies: {error}
              </div>
            ) : (
              null
            )
          ) : (
            <div className='mdbTableWrap'>
          <div className='mdbScroll'>
            <table className='mdbTable'>
              <thead>
                <tr>
                  {TABLE_COLUMNS.map(({ key, label, hint, numeric }) => {
                    const isSorted = sort.key === key;
                    return (
                      <th
                        key={key}
                        title={hint}
                        className={cellClass(key, numeric, isSorted)}
                        aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button type='button' className='mdbSort' onClick={() => toggleSort(key)}>
                          {label}
                          <span className='mdbArrow'>{isSorted ? (sort.dir === 'asc' ? '▲' : '▼') : ''}</span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr className='mdbEmptyRow'>
                    <td colSpan={TABLE_COLUMNS.length}>No movies match the current filters.</td>
                  </tr>
                )}
                {sorted.slice(0, shown).map((i) => (
                  <tr key={table.id[i]}>
                    {TABLE_COLUMNS.map(({ key, numeric }) => {
                      const locations =
                        key === 'filming_locations'
                          ? table.locations?.[i]
                              ?.split(';')
                              .map((location) => location.trim())
                              .filter(Boolean)
                          : null;

                      return (
                        <td key={key} className={cellClass(key, numeric, sort.key === key)}>
                          {locations?.length ? (
                            <div className='mdbLocations'>
                              {locations.map((location, index) => (
                                <button
                                  type='button'
                                  className='mdbLocationButton'
                                  key={`${location}:${index}`}
                                  onClick={(event) => {
                                    const rect = event.currentTarget.getBoundingClientRect();
                                    openMap([location], {
                                      x: rect.left + rect.width / 2,
                                      y: rect.top + rect.height / 2,
                                    });
                                  }}
                                  aria-label={`Show map for filming location: ${location}`}
                                  title={location}
                                >
                                  {location}
                                </button>
                              ))}
                            </div>
                          ) : (
                            renderCell(table, key, i)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {shown < sorted.length && (
            <div className='mdbTableFooter'>
              <button type='button' className='mdbButton' onClick={() => setShown(shown + PAGE_SIZE)}>
                Show more ({(sorted.length - shown).toLocaleString()} left)
              </button>
            </div>
          )}
        </div>
          )}
        </section>
      </div>
      {(!table || !detailsReady) &&
        !error &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className='mdbTableLoading' role='status' aria-live='polite'>
            <span className='mdbSpinner' aria-hidden='true' />
            Loading movie data…
          </div>,
          document.body
        )}
      {mapLocations &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`mdbMapBackdrop${mapClosing ? ' isClosing' : ''}`}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && event.animationName === 'mdbMapFadeOut') {
                finishClosingMap();
              }
            }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeMap();
            }}
          >
            <section
              ref={mapDialogRef}
              className={`mdbMapDialog${mapClosing ? ' isClosing' : ''}`}
              style={mapOrigin ? { transformOrigin: `${mapOrigin.x}% ${mapOrigin.y}%` } : undefined}
              role='dialog'
              aria-modal='true'
              aria-labelledby='mdbMapTitle'
            >
              <div className='mdbMapHeader'>
                <h2 id='mdbMapTitle'>Filming locations</h2>
                <button
                  type='button'
                  className='mdbButton'
                  onClick={closeMap}
                  aria-label='Close map'
                >
                  Close
                </button>
              </div>
              <LocationMap key={JSON.stringify(mapLocations)} locations={mapLocations} />
            </section>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Movies;