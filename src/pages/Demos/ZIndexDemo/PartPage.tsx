import {FC, PropsWithChildren, useId} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {ZIndexPart, zIndexParts} from './part-pages';
import {PartFoot} from './PartFoot';
import './PartPage.css';

type Props = {
  part: ZIndexPart;
};

export const PartPage: FC<PropsWithChildren<Props>> = ({part, children}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = zIndexParts.told(part);
  return <section aria-labelledby={titled} className="part-page">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.zIndex]} · part ${ordinal} of ${zIndexParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    {children}
    <PartFoot part={part}/>
  </section>;
};
