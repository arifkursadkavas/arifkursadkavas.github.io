import { gzipSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { asyncBufferFromFile, parquetMetadataAsync, parquetRead } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

const file = await asyncBufferFromFile('public/movies.parquet');
const metadata = await parquetMetadataAsync(file);
const count = Number(metadata.num_rows);
const baseColumns = [
  'id',
  'title',
  'duration',
  'mpa',
  'rating',
  'votes',
  'release_date',
  'movie_link',
  'genres',
];
const columns = [...baseColumns, 'directors', 'stars', 'filming_locations'];
const details = Object.fromEntries(columns.map((column) => [column, new Array(count)]));

await parquetRead({
  file,
  metadata,
  columns,
  compressors,
  onChunk: ({ columnName, columnData, rowStart }) => {
    for (let i = 0; i < columnData.length; i++) {
      details[columnName][rowStart + i] = columnData[i];
    }
  },
});

const directorAndLocationData = {
  directors: details.directors,
  filming_locations: details.filming_locations,
};
const baseData = { count, columns: Object.fromEntries(baseColumns.map((column) => [column, details[column]])) };
const compressedDetails = gzipSync(Buffer.from(JSON.stringify(directorAndLocationData)));
const compressedCast = gzipSync(Buffer.from(JSON.stringify(details.stars)));
const compressedBase = gzipSync(Buffer.from(JSON.stringify(baseData)));
await Promise.all([
  writeFile('public/movie-base.json.gz', compressedBase),
  writeFile('public/movie-details.json.gz', compressedDetails),
  writeFile('public/movie-cast.json.gz', compressedCast),
]);
console.log(
  `Generated movie data files (${compressedBase.byteLength}, ${compressedDetails.byteLength}, ` +
    `${compressedCast.byteLength} bytes)`
);
