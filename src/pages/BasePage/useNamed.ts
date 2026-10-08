import {useEffect} from 'react';

export type Named = {readonly title: string; readonly description: string};

const descriptionTag = (): HTMLMetaElement => {
  const found = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (found) return found;
  const made = document.createElement('meta');
  made.name = 'description';
  document.head.append(made);
  return made;
};

// the served index.html carries a title and a description, and a second <title> from React would sit behind the first,
// so the page updates the ones the document has
export const useNamed = ({title, description}: Named): void => {
  useEffect(() => {
    document.title = title;
    descriptionTag().content = description;
  }, [title, description]);
};
