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

  test('rejects a response without a valid range size', async () => {
    const fetcher = jest.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(null, { status: 200 }));

    await expect(parquetByteLength('/movies.parquet', fetcher)).rejects.toThrow(
      'expected a range response, got 200'
    );
  });
});
