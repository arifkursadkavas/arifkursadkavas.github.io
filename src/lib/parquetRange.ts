export async function parquetByteLength(url: string, fetcher: typeof fetch = fetch): Promise<number> {
  const response = await fetcher(url, { headers: { Range: 'bytes=0-0' } });
  const contentRange = response.headers.get('Content-Range');
  const rangeMatch = contentRange && /^bytes 0-0\/(\d+)$/i.exec(contentRange);
  if (response.status === 206 && rangeMatch) {
    const rangeSize = Number(rangeMatch[1]);
    if (Number.isSafeInteger(rangeSize) && rangeSize > 0) return rangeSize;
  }

  if (response.status === 200) {
    const contentLength = Number(response.headers.get('Content-Length'));
    if (Number.isSafeInteger(contentLength) && contentLength > 0) return contentLength;
  }

  const headResponse = await fetcher(url, { method: 'HEAD' });
  const headLength = Number(headResponse.headers.get('Content-Length'));
  if (Number.isSafeInteger(headLength) && headLength > 0) return headLength;

  throw new Error(
    `could not determine parquet size: range status ${response.status}, ` +
      `Content-Range ${contentRange ?? 'missing'}, HEAD status ${headResponse.status}`
  );
}
