import { useCallback, useState } from "react";

export interface SuggestionHint {
  name: string;
  description: string;
  filter: (input: string) => any;

  isHidden?: boolean;
}

export interface useSuggestions {
  suggestions: Array<SuggestionHint>;
  selectNext: () => void;
  selectPrev: () => void;
  selected: string | null;
  hideSuggestions: (names: Array<string>) => void;
  unhideSuggestions: (names: Array<string>) => void;
}

export const useSuggestions = (initial: Array<SuggestionHint> | null) => {
  const [suggestions, setSuggestions] = useState<Array<SuggestionHint>>(initial ? initial : []);
  const [selected, setSelected] = useState<string | null>(null);

  const selectNext = useCallback(() => {
    if (selected === null) {
      setSelected(suggestions[0].name);
      return;
    }

    const currentIndex = suggestions.findIndex((x) => x.name === selected);
    
    if (currentIndex === suggestions.length - 1) {
      setSelected(suggestions[0].name);
    } else {
      setSelected(suggestions[currentIndex + 1].name);
    }
  }, [selected, setSelected, suggestions]);

  const selectPrev = useCallback(() => {
    if (selected === null) {
      setSelected(suggestions[suggestions.length - 1].name);
      return;
    }

    const currentIndex = suggestions.findIndex((x) => x.name === selected);
    
    if (currentIndex === 0) {
      setSelected(suggestions[suggestions.length - 1].name);
    } else {
      setSelected(suggestions[currentIndex - 1].name);
    }
  }, [selected, setSelected, suggestions]);

  const hideSuggestions = useCallback((names: Array<string>) => {
    setSuggestions(suggestions.map((x: SuggestionHint) => {
      return {...x, isHidden: !x.isHidden ? names.includes(x.name) : x.isHidden};
    }));
  }, [suggestions, setSuggestions]);

  const unhideSuggestions = useCallback((names: Array<string>) => {
    setSuggestions(suggestions.map((x: SuggestionHint) => {
      return {...x, isHidden: x.isHidden ? !names.includes(x.name) : x.isHidden};
    }));
  }, [suggestions, setSuggestions]);

  return {
    suggestions,
    selectNext,
    selectPrev,
    selected,
    hideSuggestions,
    unhideSuggestions
  }
}
