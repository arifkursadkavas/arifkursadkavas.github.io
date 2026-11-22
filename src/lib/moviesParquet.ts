import { parquetMetadataAsync, parquetRead } from 'hyparquet';
import type { AsyncBuffer, FileMetaData } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

import type { RawColumns } from './movies';

export interface MoviesSource {
  file: AsyncBuffer;
  metadata: FileMetaData;
  count: number;
}

export async function openMovies(url: string): Promise<MoviesSource> {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`could not fetch movies: ${response.status} ${response.statusText}`);
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 8) {
    throw new Error('parquet file is too small');
  }

  const magic = new Uint8Array(bytes);
  const hasHeader = magic[0] === 0x50 && magic[1] === 0x41 && magic[2] === 0x52 && magic[3] === 0x31;
  const footerStart = bytes.byteLength - 4;
  const hasFooter =
    magic[footerStart] === 0x50 &&
    magic[footerStart + 1] === 0x41 &&
    magic[footerStart + 2] === 0x52 &&
    magic[footerStart + 3] === 0x31;

  if (!hasHeader || !hasFooter) {
    throw new Error('parquet file is invalid (PAR1 magic marker missing)');
  }

  const file: AsyncBuffer = {
    byteLength: bytes.byteLength,
    slice(start: number, end?: number) {
      return Promise.resolve(bytes.slice(start, end));
    },
  };
  const metadata = await parquetMetadataAsync(file);
  return { file, metadata, count: Number(metadata.num_rows) };
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
