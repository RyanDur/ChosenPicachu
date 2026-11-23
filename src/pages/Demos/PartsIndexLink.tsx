import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import {not} from '@ryandur/sand';
import {DemoLink} from '@pages/Demos/DemoLink';

export const PartsIndexLink: FC<PropsWithChildren<{to: string; heading?: string}>> = ({to, heading, children}) => {
  const onItsPage = useLocation().pathname === to && not(heading);
  return <DemoLink className="parts-index-link" to={to} heading={heading} aria-current={onItsPage ? 'page' : undefined}>
    {children}
  </DemoLink>;
};
