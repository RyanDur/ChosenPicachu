import {FC, PropsWithChildren, useId} from 'react';
import {PartHeading} from './part-heading';
import './PartPage.css';

export const PartSection: FC<PropsWithChildren<{readonly heading: string}>> = ({heading, children}) => {
  const id = `part${useId()}`;
  return <section aria-labelledby={id} className="part-page">
    <PartHeading.Provider value={{id, heading}}>{children}</PartHeading.Provider>
  </section>;
};
