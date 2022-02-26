import { useState, useCallback } from "react";

interface SearchTag {
  name: string;
  content: string;
}

export const SearchTag = (props: SearchTag) => {
  const { name, content } = props;

  return (
    <span className="advanced-search-tag">
      <p>{name}: {content}</p>
    </span>
  );
}

interface TagHook {
  activeTags: Array<SearchTag>;
  
  appendTag: (tag: SearchTag) => void;
  setTagValue: (name: string, value: string) => void;
  popTag: () => SearchTag | null;
}

export const useSearchTags = (): TagHook => {
  const [activeTags, setActiveTags] = useState<Array<SearchTag>>([]);

  const appendTag = useCallback((tag) => {
    setActiveTags([...activeTags, tag]);
  }, [activeTags, setActiveTags]);

  const setTagValue = useCallback((tag, value) => {
    const tags = [...activeTags];
    const selectedTag = tags.findIndex((x) => x.name === tag);

    tags.splice(selectedTag, 1);

    setActiveTags([...tags, { name: tag, content: value }]);
  }, [activeTags, setActiveTags]);

  const popTag = useCallback(() => {
    const tags = [...activeTags];
    const last = tags.splice(tags.length - 1, 1);

    setActiveTags(tags);

    return last[0];
  }, [activeTags, setActiveTags]);

  return {
    activeTags,
    appendTag,
    setTagValue,
    popTag,
  }
}
