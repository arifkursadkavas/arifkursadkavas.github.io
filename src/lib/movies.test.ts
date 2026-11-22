import {
  Criteria,
  EMPTY_CRITERIA,
  buildTable,
  filterMovies,
  parseDuration,
  parseList,
  parseLocations,
  parseVotes,
  sortIndexes,
  suggest,
  facetOptions,
} from './movies';

const table = buildTable(4, {
  id: ['a', 'b', 'c', 'd'],
  title: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  duration: ['1h 30m', 'PG', '2h', null],
  mpa: ['R', 'PG', null, 'R'],
  rating: [8.1, 6.5, null, 7.2],
  votes: ['9.5K', '301', null, '1.2M'],
  release_date: [new Date('1999-05-01'), new Date('2005-01-01'), new Date('2010-01-01'), new Date('2015-01-01')],
  movie_link: ['', '', '', ''],
  genres: ["['Drama', 'Romance']", "['Drama']", "['Comedy', 'Romance']", "['Drama', 'Comedy', 'Romance']"],
  languages: ["['English']", "['French']", "['English', 'French']", "['English']"],
  countries_origin: ['[]', '[]', '[]', '[]'],
  directors: ['["Ma\'rk"]', '[]', '[]', '[]'],
  stars: ["['Zed', 'Amy']", "['Amy']", '[]', "['Bob']"],
  filming_locations: ["['Paris, France']", "['Los Angeles, California, USA (location)']", '[]', "['Nice, France (beach)']"],
});

const ids = (c: Partial<Criteria>) => filterMovies(table, { ...EMPTY_CRITERIA, ...c }).map((i) => table.id[i]);
const list = (column: any, mode: 'and' | 'or', values: string[]) => ({ id: 1, column, mode, values });

describe('parseList', () => {
  test('handles both quote styles and apostrophes', () => {
    expect(parseList("['Drama', 'Musical']")).toEqual(['Drama', 'Musical']);
    expect(parseList('["George More O\'Ferrall", \'Plain\']')).toEqual(["George More O'Ferrall", 'Plain']);
    expect(parseList("['It\\'s']")).toEqual(["It's"]);
  });

  test('treats empty values as no entries', () => {
    expect(parseList(null)).toEqual([]);
    expect(parseList('')).toEqual([]);
    expect(parseList('[]')).toEqual([]);
  });
});

test('parseVotes expands K and M suffixes', () => {
  expect(['301', '9.5K', '1.2M', null].map(parseVotes)).toEqual([301, 9500, 1200000, 0]);
});

test('parseLocations returns the place and each parent, without the trailing note', () => {
  expect(parseLocations("['Los Angeles, California, USA (location)']")).toEqual([
    'Los Angeles, California, USA',
    'California, USA',
    'USA',
  ]);
  expect(parseLocations("['Sofia, Bulgaria', 'Paris, France']")).toEqual([
    'Sofia, Bulgaria',
    'Bulgaria',
    'Paris, France',
    'France',
  ]);
  expect(parseLocations('[]')).toEqual([]);
  expect(parseLocations(null)).toEqual([]);
});

test('parseDuration returns minutes and ignores values that are not a length', () => {
  expect(['1h 50m', '2h', '45m', 'PG', '', null].map(parseDuration)).toEqual([110, 120, 45, null, null, null]);
});

describe('sortIndexes', () => {
  const all = [0, 1, 2, 3];
  const sorted = (key: any, dir: 'asc' | 'desc') =>
    sortIndexes(table, all, { key, dir }).map((i) => table.id[i]);

  test('sorts numbers and text in both directions', () => {
    expect(sorted('title', 'asc')).toEqual(['a', 'b', 'd', 'c']);
    expect(sorted('title', 'desc')).toEqual(['c', 'd', 'b', 'a']);
    expect(sorted('year', 'desc')).toEqual(['d', 'c', 'b', 'a']);
    expect(sorted('votes', 'desc')).toEqual(['d', 'a', 'b', 'c']);
  });

  test('rows without a value come last whichever the direction', () => {
    expect(sorted('rating', 'desc')).toEqual(['a', 'd', 'b', 'c']);
    expect(sorted('rating', 'asc')).toEqual(['b', 'd', 'a', 'c']);
    // "PG" is not a length and d has none, so both count as missing; d has more votes
    expect(sorted('duration', 'desc')).toEqual(['c', 'a', 'd', 'b']);
  });

  test('list columns sort by their joined values', () => {
    expect(sorted('stars', 'asc')).toEqual(['b', 'd', 'a', 'c']);
    expect(sorted('stars', 'desc')).toEqual(['a', 'd', 'b', 'c']);
  });

  test('filming locations sort by the text shown in the column', () => {
    expect(sorted('filming_locations', 'asc')).toEqual(['b', 'd', 'a', 'c']);
    expect(sorted('filming_locations', 'desc')).toEqual(['a', 'd', 'b', 'c']);
  });

  test('score sorts by votes × rating, so popular well-rated films beat obscure high ratings', () => {
    const scored = buildTable(4, {
      id: ['obscure', 'classic', 'popular', 'unrated'],
      title: ['O', 'C', 'P', 'U'],
      duration: [null, null, null, null],
      rating: [9.9, 9.0, 6.0, null],
      votes: ['8', '2M', '3M', '500'],
      release_date: Array(4).fill(new Date('2000-01-01')),
      movie_link: ['', '', '', ''],
    });
    const order = (dir: 'asc' | 'desc') =>
      sortIndexes(scored, [0, 1, 2, 3], { key: 'score', dir }).map((i) => scored.id[i]);
    expect(scored.score).toEqual([79.2, 18000000, 18000000, null]);
    // classic and popular tie on score; the one with more votes comes first
    expect(order('desc')).toEqual(['popular', 'classic', 'obscure', 'unrated']);
    expect(order('asc')).toEqual(['obscure', 'popular', 'classic', 'unrated']);
  });

  test('ties are broken by votes, most voted first, in both directions', () => {
    const tied = buildTable(3, {
      id: ['x', 'y', 'z'],
      title: ['X', 'Y', 'Z'],
      duration: [null, null, null],
      rating: [8, 8, 9],
      votes: ['10', '5K', '1'],
      release_date: [new Date('2000-01-01'), new Date('2000-01-01'), new Date('2000-01-01')],
      movie_link: ['', '', ''],
    });
    const order = (dir: 'asc' | 'desc') =>
      sortIndexes(tied, [0, 1, 2], { key: 'rating', dir }).map((i) => tied.id[i]);
    expect(order('desc')).toEqual(['z', 'y', 'x']);
    expect(order('asc')).toEqual(['y', 'x', 'z']);
  });
});

describe('filterMovies', () => {
  test('OR within a column matches movies having any selected value', () => {
    expect(ids({ lists: [list('genres', 'or', ['Comedy', 'Drama'])] })).toEqual(['a', 'b', 'c', 'd']);
    expect(ids({ lists: [list('languages', 'or', ['French'])] })).toEqual(['b', 'c']);
  });

  test('AND within a column requires every selected value', () => {
    expect(ids({ lists: [list('genres', 'and', ['Drama', 'Romance'])] })).toEqual(['a', 'd']);
    expect(ids({ lists: [list('genres', 'and', ['Drama', 'Comedy', 'Romance'])] })).toEqual(['d']);
  });

  test('filters combine with AND or OR across columns', () => {
    const lists = [list('genres', 'or', ['Comedy']), { ...list('languages', 'or', ['French']), id: 2 }];
    expect(ids({ lists, combine: 'and' })).toEqual(['c']);
    expect(ids({ lists, combine: 'or' })).toEqual(['b', 'c', 'd']);
  });

  test('scalar filters and list filters work together', () => {
    expect(ids({ minRating: 7, yearFrom: 2000, lists: [list('genres', 'or', ['Drama'])] })).toEqual(['d']);
    expect(ids({ title: 'ta', combine: 'and', lists: [list('mpa', 'or', ['PG'])] })).toEqual(['b']);
  });

  test('empty filters and filters on unloaded columns do not constrain', () => {
    expect(ids({ lists: [list('genres', 'and', [])] })).toHaveLength(4);
    expect(ids({ lists: [list('writers', 'and', ['Someone'])] })).toHaveLength(4);
  });

  test('stars filter supports any / all of the selected stars', () => {
    expect(ids({ lists: [list('stars', 'or', ['Zed', 'Bob'])] })).toEqual(['a', 'd']);
    expect(ids({ lists: [list('stars', 'and', ['Zed', 'Amy'])] })).toEqual(['a']);
  });

  test('filming locations match at country, state and city level', () => {
    expect(ids({ lists: [list('filming_locations', 'or', ['France'])] })).toEqual(['a', 'd']);
    expect(ids({ lists: [list('filming_locations', 'or', ['France', 'California, USA'])] })).toEqual(['a', 'b', 'd']);
    expect(ids({ lists: [list('filming_locations', 'and', ['USA', 'California, USA'])] })).toEqual(['b']);
    expect(ids({ lists: [list('filming_locations', 'or', ['Nice, France'])] })).toEqual(['d']);
  });
});

test('suggest ranks by popularity, filters by text and skips selected values', () => {
  const options = facetOptions(table.lists.genres);
  expect(options.map((o) => o.value)).toEqual(['Drama', 'Romance', 'Comedy']);
  expect(suggest(options, 'ROM', []).map((o) => o.value)).toEqual(['Romance']);
  expect(suggest(options, '', ['Drama']).map((o) => o.value)).toEqual(['Romance', 'Comedy']);
});
