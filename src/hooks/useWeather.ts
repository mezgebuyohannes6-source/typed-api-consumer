"use client";

import { useEffect, useRef, useState } from "react";
import type { CityResult } from "@/utils/locations";
import { formatCityLabel } from "@/utils/locations";

/** One hour's forecast point, used to render the hourly list with .map(). */
export interface HourlyPoint {
  time: string;
  temperature: number;
}

/** The shape of the weather data once a city has been chosen and fetched. */
export interface WeatherData {
  cityLabel: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  hourly: HourlyPoint[];
}

/**
 * Every state the screen can be in, modelled as one union type instead of
 * separate booleans — this makes impossible combinations (e.g. "loading"
 * AND "error" at once) simply not representable.
 */
export type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: WeatherData };

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Shape of the raw JSON from Open-Meteo's geocoding search endpoint
 * (only the fields this app actually uses).
 */
interface GeocodingApiResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  }>;
}

/** Shape of the raw JSON from Open-Meteo's forecast endpoint. */
interface ForecastApiResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

/** Shared geocoding lookup — used by both the live-typing hints and the submit button. */
async function searchCities(query: string): Promise<CityResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const response = await fetch(url);
  const data: GeocodingApiResponse = await response.json();

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export function useWeather() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [state, setState] = useState<WeatherState>({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Give a "hint" as the user types: debounced live search ---
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch {
        // A failed suggestion lookup shouldn't break the whole page —
        // just show no hints rather than an error state.
        setSuggestions([]);
      }
    }, 350); // wait for the user to pause typing before searching

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  /** Called when the user picks a suggestion — fetches its weather. */
  async function selectCity(city: CityResult, cityLabel: string) {
    setSuggestions([]);
    setQuery(cityLabel);
    setState({ status: "loading" });

    try {
      const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&hourly=temperature_2m&timezone=auto`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: ForecastApiResponse = await response.json();

      // Line up the hourly times with the current hour, and take the next 8.
      const startIndex = data.hourly.time.findIndex(
        (t) => t >= data.current_weather.time
      );
      const safeStart = startIndex === -1 ? 0 : startIndex;

      const hourly: HourlyPoint[] = data.hourly.time
        .slice(safeStart, safeStart + 8)
        .map((time, i) => ({
          time,
          temperature: data.hourly.temperature_2m[safeStart + i],
        }));

      setState({
        status: "success",
        data: {
          cityLabel,
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode,
          hourly,
        },
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching the weather.",
      });
    }
  }

  /**
   * Called when the user clicks the search icon (or presses Enter) —
   * finishes the search using whatever they've typed so far, without
   * requiring them to click a specific suggestion.
   */
  async function submitSearch() {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;

    // If a suggestion is already sitting there from live typing, just use
    // the top match instead of re-fetching the same search again.
    if (suggestions.length > 0) {
      const top = suggestions[0];
      await selectCity(top, formatCityLabel(top));
      return;
    }

    setState({ status: "loading" });
    try {
      const results = await searchCities(trimmed);
      if (results.length === 0) {
        setState({ status: "error", message: `No city found for "${trimmed}".` });
        return;
      }
      const top = results[0];
      await selectCity(top, formatCityLabel(top));
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while searching for that city.",
      });
    }
  }

  return { query, setQuery, suggestions, state, selectCity, submitSearch };
}