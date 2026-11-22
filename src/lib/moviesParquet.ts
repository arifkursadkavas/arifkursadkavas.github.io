import { asyncBufferFromUrl, cachedAsyncBuffer, parquetMetadataAsync, parquetRead } from 'hyparquet';
import type { AsyncBuffer, FileMetaData } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

import type { RawColumns } from './movies';
import { parquetByteLength } from './parquetRange';

export interface MoviesSource {
  file: AsyncBuffer;
  metadata: FileMetaData;
  count: number;
}

export async function openMovies(url: string): Promise<MoviesSource> {
  const byteLength = await parquetByteLength(url);
  const remoteFile = await asyncBufferFromUrl({ url, byteLength });
  const file = cachedAsyncBuffer(remoteFile, { minSize: 64 * 1024 });
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
