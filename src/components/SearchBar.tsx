import type { CityResult } from "@/utils/locations";
import { formatCityLabel } from "@/utils/locations";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: CityResult[];
  onSelect: (city: CityResult, label: string) => void;
  onSubmit: () => void;
}

/**
 * The search input plus its dropdown of live "hints" (suggestions),
 * and a search icon button on the right that finishes the search
 * for whatever text is currently typed — either by clicking the
 * icon, or by pressing Enter.
 */
export function SearchBar({ query, onQueryChange, suggestions, onSelect, onSubmit }: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Search for a city…"
          aria-label="Search for a city"
          className="search-bar__input"
        />

        <button
          type="button"
          onClick={onSubmit}
          aria-label="Search"
          className="search-bar__icon-button"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="search-bar__suggestions">
          {suggestions.map((city) => {
            const label = formatCityLabel(city);
            return (
              <li key={city.id}>
                <button
                  type="button"
                  className="search-bar__suggestion"
                  onClick={() => onSelect(city, label)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}