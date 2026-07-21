import type { WeatherData } from "@/hooks/useWeather";
import { formatTemperature, describeWeatherCode } from "@/utils/formatters";

interface WeatherCardProps {
  data: WeatherData;
}

/**
 * Displays the current conditions for whichever city was selected.
 */
export function WeatherCard({ data }: WeatherCardProps) {
  const weather = describeWeatherCode(data.weathercode);

  return (
    <div className="weather-card">
      <p className="weather-card__city">{data.cityLabel}</p>
      <p className="weather-card__emoji">{weather.emoji}</p>
      <p className="weather-card__temp">{formatTemperature(data.temperature)}</p>
      <p className="weather-card__label">{weather.label}</p>
      <p className="weather-card__wind">Wind: {Math.round(data.windspeed)} km/h</p>
    </div>
  );
}