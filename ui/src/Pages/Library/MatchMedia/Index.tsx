import { useState, useCallback } from "react";
import NestedFileView from "Components/NestedFileView/Index";
import SimpleSearch from "Components/SimpleSearch";
import AdvancedSearch from "Components/AdvancedSearch/Index";
import SearchResult from "./SearchResult";
import { SearchResultContext } from "./Context";

import AngleUp from "assets/Icons/AngleUp";
import "./Index.scss";

const files = [
  {
    name: "Folder A",
    type: "folder",
    content: [
      {
        name: "Inner Folder A",
        type: "folder",
        content: [
          {
            name: "Folder B",
            type: "folder",
            content: [
              {
                name: "inner file b",
                type: "file",
              },
            ],
          },
          {
            name: "File A",
            type: "file",
          },
        ],
      },
    ],
  },
];

const description =
  "In the distant future, mankind has lived quietly and restlessly underground for hundreds of years, subject to earthquakes and cave-ins. Living in one such village are 2 young men: one named Simon who is shy and naïve, and the other named Kamina who believes in the existence of a “surface” world above their heads.";

const MatchMedia = () => {
  const [current, setCurrent] = useState<number | null>(null);
  const [isOpened, setOpened] = useState<boolean>(true);

  const setCurrentCallback = useCallback((current: number | null) => {
    setCurrent(current);
  }, [setCurrent]);

  const toggleOpen = useCallback(() => {
    setOpened(!isOpened);
  }, [isOpened, setOpened]);

  const matchSelected = useCallback(() => {
    console.log("Matching selected files.");
  }, []);

  const keys = [1,2,3,4,5,6];
  
  const results = keys.map((id) => <SearchResult description={description} title="test" year="2006" rating="8.7" duration="1hr 35m" id={id} genres={["Adventure", "Comedy", "Anime"]} />);

  return (
    <div className={`match-media open-${isOpened}`}>
      <div className="match-container">
        <div className="match-left">
          <p className="match-head">3 Unmatched files found</p>
          <div className="match-middle">
            <p className="match-label">View and select files to match.</p>
            <SimpleSearch />
          </div>

          <NestedFileView files={files} />
        </div>
        <div className="match-right">
          <div className="search-head">
            <AdvancedSearch hideSearchBar={!isOpened} />
            <div className={`toggle ${!isOpened ? "invert" : ""}`} onClick={toggleOpen}>
              <AngleUp />
            </div>
          </div>

          <div className="search-results">
            <SearchResultContext.Provider value={{current, setCurrent: setCurrentCallback, match: matchSelected}}>
              { results }
            </SearchResultContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchMedia;
