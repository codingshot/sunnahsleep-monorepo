/**
 * Qibla direction (angle from North, clockwise) from user coordinates to Kaaba, Mecca.
 * Kaaba: 21.4225° N, 39.8262° E
 */

const MECCA_LAT = (21.4225 * Math.PI) / 180;
const MECCA_LON = (39.8262 * Math.PI) / 180;

export function qiblaAngleFromCoords(latitude: number, longitude: number): number {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  const deltaLon = MECCA_LON - lon;
  const x = Math.sin(deltaLon);
  const y = Math.cos(lat) * Math.tan(MECCA_LAT) - Math.sin(lat) * Math.cos(deltaLon);
  let angle = (Math.atan2(x, y) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return Math.round(angle);
}

export function qiblaDescription(angle: number): string {
  if (angle >= 337.5 || angle < 22.5) return "North";
  if (angle >= 22.5 && angle < 67.5) return "North-East";
  if (angle >= 67.5 && angle < 112.5) return "East";
  if (angle >= 112.5 && angle < 157.5) return "South-East";
  if (angle >= 157.5 && angle < 202.5) return "South";
  if (angle >= 202.5 && angle < 247.5) return "South-West";
  if (angle >= 247.5 && angle < 292.5) return "West";
  return "North-West";
}
