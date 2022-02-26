import { useState, useCallback, useRef, useEffect } from "react";
import SearchIcon from "assets/figma_icons/Search";
import Suggestions from "./Suggestions";
import { SearchTag, useSearchTags } from "./TagHook";
import { useSuggestions } from "./SuggestionsHook";
import { SearchContext } from "./Context";
import "./Index.scss";

const filterInt = (input: string) => {
  const parsed = Number(input);
  return isNaN(parsed) ? null : parsed;
}

const isOption = (options: string[]) => {
  return (input: string) => {
    return options.includes(input) ? input : null;
  }
}

export const AdvancedSearch = (props: any) => {
  const { hideSearchBar } = props;
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLDivElement>(null);
  const { activeTags, appendTag, setTagValue, popTag } = useSearchTags();
  const suggestionsState = useSuggestions([
    { name: "Year", description: "filter search results by year.", filter: filterInt},
    { name: "Media", description: "filter search results by media type (Movies, or TV Shows).", filter: isOption(["Movies", "TV Shows"])},
  ]);

  const { suggestions, selectNext, selectPrev, selected, hideSuggestions, unhideSuggestions } = suggestionsState;
    
  const onInput = useCallback(
    (e) => {
      setValue(e.target.innerText);
    },
    [setValue]
  );

  const toggleSuggestions = useCallback(() => {
    setShowSuggestions(!showSuggestions);
  }, [showSuggestions, setShowSuggestions]);

  // Callback attempt to parse input and append it to a un-filled tag if possible.
  const matchInput = useCallback(() => {
    if (activeTags.length === 0) return;

    const lastTag = activeTags[activeTags.length - 1];

    if (!lastTag || typeof suggestions === "undefined") return;

    const caretPosition = document?.getSelection()?.focusOffset;
    const focusedValue = value.substring(0, caretPosition);

    // @ts-ignore
    const suggestionsFilter = suggestions.find((x) => x.name === lastTag!.name).filter;

    if (suggestionsFilter) {
      const filteredValue = suggestionsFilter(focusedValue);
      if (filteredValue) {
        setTagValue(lastTag.name, filteredValue);

        // clear the parsed value from the main input
        const rest = value.substring(caretPosition || 0, value.length);
        inputRef.current!.innerText = rest;
      }
    }
  }, [value, activeTags, suggestions, inputRef, setTagValue])

  const onEnter = useCallback(() => {
    // TODO: Call `search` api callback here.
    if (!selected) return;

    appendTag({ name: selected, content: ""});
    hideSuggestions([selected]);
  }, [selected, appendTag, hideSuggestions]);

  const onBackspace = useCallback(() => {
    const caretPosition = document?.getSelection()?.focusOffset;

    // only pop the last tag if we run backspace on the tag
    if (caretPosition === 0) {
      const tag = popTag();
      if (tag)
        unhideSuggestions([tag.name]);
    }
  }, [popTag, unhideSuggestions]);

  const onKeyDown = useCallback((e) => {
    if (e.key === "ArrowDown")
      selectNext();

    if (e.key === "ArrowUp")
      selectPrev();

    if (e.key === "Enter") {
      // Prevent deault event handler so we dont get newlines in our div.
      e.preventDefault();
      onEnter();
    }

    // Some tags such as year might be filled after a space automatically
    if (e.key === " ") {
      matchInput();
    }

    if (e.key === "Backspace") {
      onBackspace();
    }
  }, [selectNext, matchInput, selectPrev, onEnter, onBackspace]);

  return (
    <>
      <div className={`advanced-search hidden-${hideSearchBar}`}>
        <div className="advanced-search-wrapper">
          <div className="advanced-search-field">
            { activeTags.map(({name, content}) => <SearchTag name={name} content={content} />) }
            <div
              className="advanced-search-input"
              onKeyDown={onKeyDown}
              onInput={onInput}
              onFocus={toggleSuggestions}
              onBlur={toggleSuggestions}
              contentEditable="true"
              ref={inputRef}
              spellCheck="false"
              placeholder="Search..."
            />
          </div>
          <SearchIcon />
        </div>
      </div>
      <SearchContext.Provider value={{active: showSuggestions, suggestionsState}}>
        <Suggestions />
      </SearchContext.Provider>
    </>
  );
};

export default AdvancedSearch;
