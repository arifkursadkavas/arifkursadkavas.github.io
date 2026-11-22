import { asyncBufferFromUrl, cachedAsyncBuffer, parquetMetadataAsync, parquetRead } from 'hyparquet';
import type { AsyncBuffer, FileMetaData } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

import { BASE_COLUMNS, type RawColumns } from './movies';
import { parquetByteLength } from './parquetRange';

export interface MoviesSource {
  file: AsyncBuffer;
  metadata: FileMetaData;
  count: number;
}

export interface MovieDetails {
  directors: Array<string | null>;
  filming_locations: Array<string | null>;
}

export interface MovieBase {
  count: number;
  columns: RawColumns;
}

function isStringColumn(values: unknown, count: number): values is Array<string | null> {
  return (
    Array.isArray(values) &&
    values.length === count &&
    values.every((value) => value === null || typeof value === 'string')
  );
}

async function fetchGzipJson(url: string, label: string): Promise<unknown> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('this browser does not support gzip decompression');
  }

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`could not load ${label}: HTTP ${response.status}`);
  }

  const decompressed = response.body.pipeThrough(new DecompressionStream('gzip'));
  return new Response(decompressed).json();
}

export async function openMovies(url: string): Promise<MoviesSource> {
  const byteLength = await parquetByteLength(url);
  const remoteFile = await asyncBufferFromUrl({ url, byteLength });
  const file = cachedAsyncBuffer(remoteFile, { minSize: 64 * 1024 });
  const metadata = await parquetMetadataAsync(file);
  return { file, metadata, count: Number(metadata.num_rows) };
}

export async function fetchMovieBase(url: string): Promise<MovieBase> {
  const data = await fetchGzipJson(url, 'movie base data');
  if (
    typeof data !== 'object' ||
    data === null ||
    !('count' in data) ||
    typeof data.count !== 'number' ||
    !Number.isSafeInteger(data.count) ||
    data.count <= 0 ||
    !('columns' in data) ||
    typeof data.columns !== 'object' ||
    data.columns === null
  ) {
    throw new Error('movie base file has an invalid format');
  }

  const count = data.count;
  const columns = data.columns as Record<string, unknown>;
  for (const column of BASE_COLUMNS) {
    if (!Array.isArray(columns[column]) || columns[column].length !== count) {
      throw new Error(`movie base column "${column}" has an invalid shape`);
    }
  }

  return { count, columns: columns as RawColumns };
}

export async function fetchMovieDetails(url: string, count: number): Promise<MovieDetails> {
  const data = await fetchGzipJson(url, 'movie details');
  if (
    typeof data !== 'object' ||
    data === null ||
    !('directors' in data) ||
    !('filming_locations' in data) ||
    !isStringColumn(data.directors, count) ||
    !isStringColumn(data.filming_locations, count)
  ) {
    throw new Error('movie details file has an invalid format');
  }

  return { directors: data.directors, filming_locations: data.filming_locations };
}

export async function fetchMovieCast(url: string, count: number): Promise<Array<string | null>> {
  const data = await fetchGzipJson(url, 'movie cast');
  if (!isStringColumn(data, count)) {
    throw new Error('movie cast file has an invalid format');
  }
  return data;
}

/** Reads only the requested columns; the other column chunks are never downloaded. */
export async function readColumns(source: MoviesSource, columns: string[]): Promise<RawColumns> {
  const out: Record<string, any[]> = {};
  for (const column of columns) out[column] = new Array(source.count);

  await parquetRead({
    file: source.file,
    metadata: source.metadata,
    columns,
    compressors,
    onChunk: ({ columnName, columnData, rowStart }) => {
      const target = out[columnName];
      for (let i = 0; i < columnData.length; i++) target[rowStart + i] = columnData[i];
    },
  });
  return out;
}
