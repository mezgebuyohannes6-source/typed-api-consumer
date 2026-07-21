/**
 * A single place returned by the Open-Meteo geocoding search.
 * This is the shape we get back when the user searches a city name.
 */
export interface CityResult {
  id: number;
  name: string;
  country: string;
  admin1?: string; // region/state, not always present
  latitude: number;
  longitude: number;
}

/**
 * Builds a friendly one-line label for a search result,
 * e.g. "Addis Ababa, Ethiopia" or "Portland, Oregon, United States".
 */
export function formatCityLabel(city: CityResult): string {
  const parts = [city.name, city.admin1, city.country].filter(Boolean);
  return parts.join(", ");
}

export function extractSearchTerm(text: string): string {
  const [namePart] = text.split(",");
  return namePart.trim();
}
/**
 * Shown as quick-pick hints before the user has typed anything,
 * so the search bar isn't empty on first load.
 */
export const POPULAR_CITIES: CityResult[] = [
  { id: 1, name: "Addis Ababa", country: "Ethiopia", latitude: 9.03, longitude: 38.74 },
  { id: 2, name: "London", country: "United Kingdom", latitude: 51.51, longitude: -0.13 },
  { id: 3, name: "Tokyo", country: "Japan", latitude: 35.68, longitude: 139.69 },
  { id: 4, name: "New York", country: "United States", latitude: 40.71, longitude: -74.01 },
];