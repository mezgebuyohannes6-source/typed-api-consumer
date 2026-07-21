"use client";

import { useWeather } from "@/hooks/useWeather";
import { SearchBar } from "@/components/SearchBar";
import { StatusMessage } from "@/components/StatusMessage";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherList } from "@/components/WeatherList";

export default function HomePage() {
  const { query, setQuery, suggestions, state, selectCity, submitSearch } = useWeather();

  return (
    <main className="page">
      <div className="page__overlay">
        <h1 className="page__title">Weather Search</h1>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          onSelect={selectCity}
          onSubmit={submitSearch}
        />

        <div className="page__result">
          {state.status !== "success" && (
            <StatusMessage
              status={state.status}
              message={state.status === "error" ? state.message : undefined}
            />
          )}

          {state.status === "success" && (
            <>
              <WeatherCard data={state.data} />
              <WeatherList hourly={state.data.hourly} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}