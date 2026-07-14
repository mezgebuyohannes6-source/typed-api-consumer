export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°C`;
}

export function formatHour(isoTime: string): string {
  const [, time] = isoTime.split("T");
  return time ? time.slice(0, 5) : isoTime;
}

/**
 * Open-Meteo returns a numeric "weathercode" following the standard
 * WMO weather interpretation codes. This maps the common ones to a
 * short label + emoji so the UI never shows a raw, meaningless number.
 */
const WEATHER_CODE_MAP: Record<number, { label: string; emoji: string }> = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Fog", emoji: "🌫️" },
  48: { label: "Depositing rime fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  61: { label: "Slight rain", emoji: "🌧️" },
  63: { label: "Moderate rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  71: { label: "Slight snow", emoji: "🌨️" },
  80: { label: "Rain showers", emoji: "🌦️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
};

export function describeWeatherCode(code: number): { label: string; emoji: string } {
  return WEATHER_CODE_MAP[code] ?? { label: "Unknown", emoji: "🌡️" };
}