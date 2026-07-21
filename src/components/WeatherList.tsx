import type { HourlyPoint } from "@/hooks/useWeather";
import { formatHour, formatTemperature } from "@/utils/formatters";

interface WeatherListProps {
  hourly: HourlyPoint[];
}

/**
 * Renders the next few hours of forecast data as a horizontal list.
 * This is the ".map() over typed data" part of the assignment.
 */
export function WeatherList({ hourly }: WeatherListProps) {
  return (
    <ul className="weather-list">
      {hourly.map((point) => (
        <li key={point.time} className="weather-list__item">
          <span className="weather-list__hour">{formatHour(point.time)}</span>
          <span className="weather-list__temp">{formatTemperature(point.temperature)}</span>
        </li>
      ))}
    </ul>
  );
}