import {FC} from 'react';
import {useControls} from '../Controls';
import {foldInput} from './fold-input';
import {PartLink} from './PartLink';
import {HeadingLink} from './HeadingLink';

export const PlatformGivesNowIntroduction: FC = () => {
  const input = foldInput.of(useControls().foldType);
  return <p className="paragraph">This part builds on two before it:
    “<HeadingLink heading="html-alone-heading"/>”, on the tab, for details and summary, and
    “<PartLink part="a-box-remembers-the-fold"/>”, for the {input} build it replaces.</p>;
};
