import { gzipSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { asyncBufferFromFile, parquetMetadataAsync, parquetRead } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

const file = await asyncBufferFromFile('public/movies.parquet');
const metadata = await parquetMetadataAsync(file);
const count = Number(metadata.num_rows);
const columns = ['directors', 'stars', 'filming_locations'];
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
const compressedDetails = gzipSync(Buffer.from(JSON.stringify(directorAndLocationData)));
const compressedCast = gzipSync(Buffer.from(JSON.stringify(details.stars)));
await Promise.all([
  writeFile('public/movie-details.json.gz', compressedDetails),
  writeFile('public/movie-cast.json.gz', compressedCast),
]);
console.log(
  `Generated movie detail files (${compressedDetails.byteLength} + ${compressedCast.byteLength} bytes)`
);
