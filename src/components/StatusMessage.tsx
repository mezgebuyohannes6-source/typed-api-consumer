interface StatusMessageProps {
  status: "idle" | "loading" | "error";
  message?: string;
}

/**
 * Renders the non-data states: idle (nothing searched yet),
 * loading, and error. The "success" state is handled by
 * WeatherCard + WeatherList instead.
 */
export function StatusMessage({ status, message }: StatusMessageProps) {
  if (status === "idle") {
    return <p className="status-message">Search a city to see its weather.</p>;
  }

  if (status === "loading") {
    return (
      <p className="status-message" role="status">
        Loading weather…
      </p>
    );
  }

  return (
    <p className="status-message status-message--error" role="alert">
      Error: {message}
    </p>
  );
}