import { createContext } from "react";

export interface SearchResultContext {
  // Currently selected search result
  current: number | null;
  // Alter currently selected result
  setCurrent: (current: number | null) => void;
  // Callback for matching files to a result
  match: () => void;
}

export const SearchResultContext = createContext<SearchResultContext>({
  current: null,
  setCurrent: () => {},
  match: () => {}
});
