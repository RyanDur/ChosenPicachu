import {FC} from 'react';
import {PartsNavigation} from '@pages/Demos/PartsNavigation';
import {PartsNavigationEntry} from '@pages/Demos/PartsNavigationEntry';
import {PartsNavigationGroup} from '@pages/Demos/PartsNavigationGroup';
import {BookPart, accordionParts} from './part-pages';

const ordinalOf = (heading: BookPart): number => accordionParts.inOrder.indexOf(heading) + 1;

const howWeUsedToBuildAFold: readonly BookPart[] = ['remembers-heading', 'max-height-guess-heading', 'measured-heading'];

const whatThePlatformGivesNow: readonly BookPart[] = ['platform-way-heading', 'motion-heading'];

const Entry: FC<{heading: BookPart}> = ({heading}) => {
  const {to, heading: fragment, title, minutes, says} = accordionParts.listed(heading);
  return <PartsNavigationEntry to={to} heading={fragment} name={title} minutes={minutes} says={says}/>;
};

export const PartsIndex: FC = () =>
  <PartsNavigation>
    <ol className="parts-index-list numbered">
      <Entry heading="html-alone-heading"/>
    </ol>
    <PartsNavigationGroup label="How we used to build a fold" start={ordinalOf(howWeUsedToBuildAFold[0])}>
      {howWeUsedToBuildAFold.map(heading => <Entry key={heading} heading={heading}/>)}
    </PartsNavigationGroup>
    <PartsNavigationGroup label="What the platform gives now" start={ordinalOf(whatThePlatformGivesNow[0])}>
      {whatThePlatformGivesNow.map(heading => <Entry key={heading} heading={heading}/>)}
    </PartsNavigationGroup>
  </PartsNavigation>;
