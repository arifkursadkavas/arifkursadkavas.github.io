export async function parquetByteLength(url: string, fetcher: typeof fetch = fetch): Promise<number> {
  const response = await fetcher(url, { headers: { Range: 'bytes=0-0' } });
  if (response.status !== 206) {
    throw new Error(`could not determine parquet size: expected a range response, got ${response.status}`);
  }

  const contentRange = response.headers.get('Content-Range');
  const match = contentRange && /^bytes 0-0\/(\d+)$/i.exec(contentRange);
  const byteLength = match ? Number(match[1]) : NaN;
  if (!Number.isSafeInteger(byteLength) || byteLength <= 0) {
    throw new Error(`could not determine parquet size from Content-Range: ${contentRange ?? 'missing'}`);
  }

  return byteLength;
}
