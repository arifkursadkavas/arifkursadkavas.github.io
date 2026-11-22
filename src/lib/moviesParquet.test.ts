import { parquetByteLength } from './parquetRange';

describe('parquetByteLength', () => {
  test('reads the uncompressed size from the range response', async () => {
    const fetcher = jest.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(new Uint8Array([0x50]), {
        status: 206,
        headers: { 'Content-Range': 'bytes 0-0/38855536' },
      })
    );

    await expect(parquetByteLength('/movies.parquet', fetcher)).resolves.toBe(38855536);
    expect(fetcher).toHaveBeenCalledWith('/movies.parquet', {
      headers: { Range: 'bytes=0-0' },
    });
  });

  test('falls back to Content-Length when the server ignores the range request', async () => {
    const fetcher = jest.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(null, {
        status: 200,
        headers: { 'Content-Length': '38855536' },
      })
    );

    await expect(parquetByteLength('/movies.parquet', fetcher)).resolves.toBe(38855536);
  });

  test('falls back to a HEAD request when no length is available', async () => {
    const fetcher = jest.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'HEAD') {
        return new Response(null, {
          status: 200,
          headers: { 'Content-Length': '38855536' },
        });
      }
      return new Response(null, { status: 200 });
    });

    await expect(parquetByteLength('/movies.parquet', fetcher)).resolves.toBe(38855536);
  });

  test('rejects a response without any valid size', async () => {
    const fetcher = jest.fn(async () => new Response(null, { status: 200 }));

    await expect(parquetByteLength('/movies.parquet', fetcher)).rejects.toThrow(
      'could not determine parquet size'
    );
  });
});
