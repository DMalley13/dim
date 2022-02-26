import { useContext } from "react";
import { SearchContext } from "./Context";
import "./Suggestions.scss";

const Suggestion = (props: any) => {
  const { active, name, description } = props;

  return (
    <div className={`suggestion active-${active}`}>
      <div className="title">{name}</div>
      <div className="description">{description}</div>
    </div>
  );
};

export const Suggestions = () => {
  const { active, suggestionsState } = useContext(SearchContext);
  const { suggestions, selected } = suggestionsState;

  const options = suggestions.filter((x) => !x.isHidden).map(({name, description}) => <Suggestion active={selected === name} name={name} description={description} />);

  return (
    <div className={`suggestions active-${!!active}`}>
      { options }
    </div>
  );
};

export default Suggestions;
