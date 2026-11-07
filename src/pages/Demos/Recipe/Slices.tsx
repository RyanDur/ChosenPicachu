import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos/types';
import {FC, ReactNode} from 'react';
import {stations} from './stations';

type SlicesProps = {
  can: string;
  soThat: string;
  slices: ReactNode;
  sliced: [string, number][];
};

export const Slices: FC<SlicesProps> = ({can, soThat, slices, sliced}) =>
  <section className="phase card rounded-corners lifted" aria-labelledby="phase-stories">
    <h3 id="phase-stories" className="phase-title title">Slice the design into stories</h3>
    <p className="overview paragraph muted-ink">
      Once the need is heard and the design has answered shape, I split the work into stories. Each is a{' '}
      <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a card, a conversation and a confirmation, as
      the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> walks
      through. The whole of it reads as one:
    </p>
    <hgroup className="story arriving card rounded-corners lifted">
      <h4 className="can paragraph bold">{can}</h4>
      <p className="so-that paragraph italic muted-ink">{soThat}</p>
    </hgroup>
    <p className="overview paragraph muted-ink">{slices}</p>
    <ul className="sliced" aria-label="the slices">
      {sliced.map(([slice, station]) =>
        <li className="italic muted-ink" key={slice}>
          <span>{slice}</span>
          <a className="slice-station signpost caption upright" href={`#${stations.idOf(station)}`}>station {station}</a>
        </li>)}
    </ul>
  </section>;
