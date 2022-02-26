import { createContext } from "react";
import { useSuggestions } from "./SuggestionsHook";

interface SearchContext {
  active: boolean;
  suggestionsState: useSuggestions;
}

export const SearchContext = createContext<SearchContext>({
  active: false,
  suggestionsState: {
    suggestions: [],
    selectNext: () => {},
    selectPrev: () => {},
    selected: null,
    hideSuggestions: (_) => {},
    unhideSuggestions: (_) => {},
  }
});
