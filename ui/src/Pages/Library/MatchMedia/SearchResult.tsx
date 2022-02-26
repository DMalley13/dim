import { useState, useCallback, useContext } from "react";
import TruncText from "Helpers/TruncText";
import { SearchResultContext } from "./Context";
import Ellipsis from "assets/Icons/Ellipsis";
import "./SearchResult.scss";

interface Props {
  description: string,
  title: string,
  year: string,
  rating: string,
  duration: string,
  genres: string[],

  id: number,
}

export const SearchResult = ({description, title, year, rating, duration, id, genres}: Props) => {
  const { current, setCurrent, match } = useContext(SearchResultContext);
  const [trunLen, setTrunLen] = useState(20);
  const isActive = current === id;

  const descriptionLen = description.split(" ").length;

  const toggleDescription = useCallback(() => {
    if (trunLen === 20)
      setTrunLen(descriptionLen);
    else
      setTrunLen(20);
  }, [trunLen, setTrunLen]);

  const toggleCard = useCallback((e) => {
    // Because we have various buttons nested inside a result card (which itself is a big button)
    // we want to detect when we clicked on a child and ignore the click on the parent.
    if (e.target.closest(".description-toggle, .button")) return;
    if (isActive)
      setCurrent(null);
    else
      setCurrent(id);
  }, [isActive, setCurrent, id]);

  const toggleCancel = useCallback(() => {
    if (isActive)
      setCurrent(null);
    else
      setCurrent(id);
  }, [isActive, setCurrent, id]);

  return (
    <div className={`result-card active-${isActive}`} onClick={toggleCard}>
      <div className="inner">
      <div className="left">
        <img
          src="https://image.tmdb.org/t/p/w200/xL6HsYsk5N9PKwk6jFwMNQq3K3M.jpg"
          alt=""
        />
      </div>
      <div className="right">
        <div className="top-row">
          <p>{title}</p>

          <div className="meta">
            <p>{rating}</p>
            <p>{year}</p>
            <p>{duration}</p>
          </div>
        </div>

        <div className="middle">
          {
            genres.map((x: string) => <p>{x}</p>)
          }
        </div>

        <div className={`bottom hide-buttons-${!isActive}`}>
          <div className="description">
            <TruncText content={description} max={trunLen} />
          </div>

          <div className="description-toggle" onClick={toggleDescription}>
            <Ellipsis />
          </div>

          <div className="buttons-row">
            <div className="button cancel-button" onClick={toggleCancel}>
              <p>
                Cancel
              </p>
            </div>
            <div className="button match-button" onClick={match}>
              <p>
                Match selected media
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SearchResult;
