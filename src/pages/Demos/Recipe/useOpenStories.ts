import {useSearchParamsOnceHydrated} from '@frame/navigation/search-params';
import {storyKeys} from './storyKeys';

type OpenStories = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
};

export const useOpenStories = (param: string): OpenStories => {
  const [shown, setSearchParams] = useSearchParamsOnceHydrated();
  return {
    isOpen: id => storyKeys.openIn(shown, param).has(id),
    toggle: id => setSearchParams(previous => storyKeys.toggledIn(previous, {param, id}),
      {replace: true, preventScrollReset: true})
  };
};
