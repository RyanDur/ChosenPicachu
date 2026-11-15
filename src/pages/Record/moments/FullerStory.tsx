import {FC, PropsWithChildren} from 'react';

export const FullerStory: FC<PropsWithChildren> = ({children}) =>
  <details className="fuller-story" name="record">
    <summary className="prompt caption">the fuller story</summary>
    {children}
  </details>;
