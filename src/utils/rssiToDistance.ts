// Convert RSSI to an approximate distance using the log-distance path loss model.
// d = 10 ^ ((TxPower - RSSI) / (10 * n))
// Where:
// - TxPower is the RSSI at 1 meter (commonly around -59 dBm for BLE)
// - n is the path-loss exponent (2.0 indoor open space, 2.5-3.0 normal indoor, 3.0-4.0 with walls)
const DEFAULT_TX_POWER = -59;
const DEFAULT_PATH_LOSS = 2.5;
const METERS_TO_FEET = 3.28084;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function rssiToSignalPercent(rssi: number): number {
  if (rssi >= -50) {
    return 100;
  }

  if (rssi >= -60) {
    return 85;
  }

  if (rssi >= -70) {
    return 70;
  }

  if (rssi >= -80) {
    return 50;
  }

  if (rssi >= -90) {
    return 25;
  }

  return 0;
}

export function rssiToDistance(
  rssi: number,
  txPower = DEFAULT_TX_POWER,
  pathLossExponent = DEFAULT_PATH_LOSS
): number {
  const distance = Math.pow(10, (txPower - rssi) / (10 * pathLossExponent));
  return Number(clamp(distance, 0, 100).toFixed(2));
}

export function rssiToDistanceFeet(
  rssi: number,
  txPower = DEFAULT_TX_POWER,
  pathLossExponent = DEFAULT_PATH_LOSS
): number {
  return Number((rssiToDistance(rssi, txPower, pathLossExponent) * METERS_TO_FEET).toFixed(2));
}

export function rssiToDistancePercent(rssi: number): number {
  if (rssi >= 0 && rssi <= 100) {
    return Math.max(0, Math.min(100, 100 - Math.round(rssi)));
  }

  const signalPercent = rssiToSignalPercent(rssi);
  return Math.max(0, Math.min(100, 100 - signalPercent));
}