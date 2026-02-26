import * as Location from "expo-location";
import type { LocationCoords } from "./storage";
import { getLocationCoords, setLocationCoords } from "./storage";

export type LocationResult = { coords: LocationCoords; error?: string };

export async function requestLocationAndGetCoords(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { coords: null, error: "Location permission denied." };
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    await setLocationCoords(coords);
    return { coords };
  } catch (e) {
    return { coords: null, error: "Could not get location." };
  }
}

export async function getCoordsForPrayer(): Promise<LocationCoords> {
  const stored = await getLocationCoords();
  if (stored) return stored;
  const result = await requestLocationAndGetCoords();
  return result.coords;
}
