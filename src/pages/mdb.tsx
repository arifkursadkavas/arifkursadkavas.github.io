import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { MoviesSource, openMovies, readColumns } from '../lib/moviesParquet';

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
  { key: 'stars', label: 'Stars' },
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
      return longText(t.lists.directors?.[i]?.join(', '));
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
  const [criteria, setCriteria] = useState<Criteria>(DEFAULT_CRITERIA);
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [mapLocations, setMapLocations] = useState<string[] | null>(null);

  const source = useRef<MoviesSource | null>(null);
  const pending = useRef(new Set<ListColumn>());
  const facetCache = useRef(new WeakMap<string[][], FacetOption[]>());
  const nextFilterId = useRef(DEFAULT_CRITERIA.lists.length);

  useEffect(() => {
    if (!mapLocations) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMapLocations(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapLocations]);

  const ensureColumn = useCallback(async (column: ListColumn) => {
    if (!source.current || pending.current.has(column)) return;
    pending.current.add(column);
    try {
      const raw = await readColumns(source.current, [column]);
      setTable((t) => (t ? addListColumn(t, column, raw[column]) : t));
    } catch (e) {
      pending.current.delete(column);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const src = await openMovies('/movies.parquet');
        const raw = await readColumns(src, BASE_COLUMNS);
        if (cancelled) return;
        source.current = src;
        setTable(buildTable(src.count, raw));
        // Default filters and large list columns load after the table is usable.
        void ensureColumn('stars');
        void ensureColumn('filming_locations');
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

  // the distinct values of a column are only computed once per loaded column
  const options = useMemo(() => {
    const out: Partial<Record<ListColumn, FacetOption[]>> = {};
    if (table) {
      for (const column of Object.keys(table.lists) as ListColumn[]) {
        const rows = table.lists[column];
        let facets = facetCache.current.get(rows);
        if (!facets) {
          facets = facetOptions(rows);
          facetCache.current.set(rows, facets);
        }
        out[column] = facets;
      }
    }
    return out;
  }, [table]);

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
        path='/mdb'
      />
      <h1>Movie Database Browser</h1>

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
                  selected={filter.values}
                  label={label}
                  placeholder={`Search ${label.toLowerCase()}…`}
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

      <div className='mdbStatus'>
        {error
          ? `Could not load movies: ${error}`
          : table
            ? `${matches.length.toLocaleString()} of ${table.count.toLocaleString()} movies`
            : 'Loading movies…'}
      </div>

      {table && (
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
                    {TABLE_COLUMNS.map(({ key, numeric }) => (
                      <td key={key} className={cellClass(key, numeric, sort.key === key)}>
                        {key === 'filming_locations' && table.locations?.[i] ? (
                          <button
                            type='button'
                            className='mdbLocationButton'
                            onClick={() =>
                              setMapLocations(
                                table.locations![i]
                                  .split(';')
                                  .map((location) => location.trim())
                                  .filter(Boolean)
                              )
                            }
                            aria-label={`Show map for filming locations: ${table.locations[i]}`}
                          >
                            {longText(table.locations[i])}
                          </button>
                        ) : (
                          renderCell(table, key, i)
                        )}
                      </td>
                    ))}
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
      {mapLocations &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className='mdbMapBackdrop'
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setMapLocations(null);
            }}
          >
            <section
              className='mdbMapDialog'
              role='dialog'
              aria-modal='true'
              aria-labelledby='mdbMapTitle'
            >
              <div className='mdbMapHeader'>
                <h2 id='mdbMapTitle'>Filming locations</h2>
                <button
                  type='button'
                  className='mdbButton'
                  onClick={() => setMapLocations(null)}
                  aria-label='Close map'
                >
                  Close
                </button>
              </div>
              <LocationMap locations={mapLocations} />
            </section>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Movies;