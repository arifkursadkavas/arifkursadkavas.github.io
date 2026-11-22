import { locationSearchQueries } from './nominatim';

describe('locationSearchQueries', () => {
  test('falls back from a specific address to broader geographic context', () => {
    expect(locationSearchQueries('240 North Neptune Avenue, Los Angeles, California, USA (location)')).toEqual([
      '240 North Neptune Avenue, Los Angeles, California, USA',
      'Los Angeles, California, USA',
      'California, USA',
    ]);
  });

  test('removes parenthetical notes and duplicate query candidates', () => {
    expect(locationSearchQueries('Studio (exterior), London, England, UK')).toEqual([
      'Studio, London, England, UK',
      'London, England, UK',
      'England, UK',
    ]);
  });

  test('does not broaden a single-part location', () => {
    expect(locationSearchQueries('Iceland')).toEqual(['Iceland']);
  });
});
