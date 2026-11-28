import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {useControls} from '../Controls';
import {foldInput} from './fold-input';
import {PartLink} from './PartLink';
import {HeadingLink} from './HeadingLink';
import {tabHeadings} from './tab-headings';

export const PlatformGivesNowIntroduction: FC = () => {
  const input = foldInput.of(useControls().foldType);
  return <p className="paragraph">This part builds on “<HeadingLink heading="html-alone-heading"/>”, with
    “<TabLink to={DemoTopics.accordions} heading={tabHeadings.exhibitSource}>The exhibit’s source</TabLink>” under
    it, for details and summary, and on “<PartLink part="a-box-remembers-the-fold"/>”, for the {input} build it
    replaces.</p>;
};
