import { rssiToDistance, rssiToDistanceFeet, rssiToSignalPercent } from '../src/utils/rssiToDistance';

describe('rssiToDistance utilities', () => {
  it('maps signal percent to RSSI strength correctly', () => {
    expect(rssiToSignalPercent(-50)).toBe(100);
    expect(rssiToSignalPercent(-90)).toBe(25);
  });

  it('estimates distance from RSSI using the path-loss model', () => {
    expect(rssiToDistance(-65, -59, 2)).toBeCloseTo(2.0, 1);
    expect(rssiToDistanceFeet(-65, -59, 2)).toBeCloseTo(6.56, 2);
  });

  it('returns a finite positive distance for weak RSSI values', () => {
    expect(rssiToDistance(-100)).toBeGreaterThan(0);
  });
});
