import {FC, ReactNode} from 'react';

type Props = {
  path: string;
  children: ReactNode;
};

export const Mdn: FC<Props> = ({path, children}) =>
  <a className="signpost"
     href={`https://developer.mozilla.org/en-US/docs/${path}`}
     target="_blank"
     rel="noreferrer">{children}</a>;
