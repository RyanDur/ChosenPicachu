import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {stations} from './stations';
import {storiesHeading} from '@pages/Demos/headings';

type SlicesProps = {
  can: string;
  soThat: string;
  slices: ReactNode;
  sliced: [string, number][];
  headedBy?: string;
  stationsAt?: string;
};

const StationLink: FC<{station: number; at?: string}> = ({station, at}) => {
  const carried = useCarriedAddress();
  const id = stations.idOf(station);
  return maybe(at).either(
    tab => <Link className="slice-station signpost caption upright" to={carried(tab, id)}>station {station}</Link>,
    () => <a className="slice-station signpost caption upright" href={`#${id}`}>station {station}</a>);
};

export const Slices: FC<SlicesProps> = ({can, soThat, slices, sliced, headedBy, stationsAt}) => {
  const Can: 'h3' | 'h4' = maybe(headedBy).either(() => 'h3', () => 'h4');
  return <section className="phase card rounded-corners lifted" aria-labelledby={maybe(headedBy).orElse(storiesHeading.id)}>
    {maybe(headedBy).either(
      () => null,
      () => <h3 id={storiesHeading.id} className="phase-title title">{storiesHeading.title}</h3>)}
    <p className="overview paragraph muted-ink">
      Once the need is heard and the design has answered shape, I split the work into stories. Each is
      a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a card, a conversation and a confirmation, as
      the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> walks
      through. The whole of it reads as one:
    </p>
    <hgroup className="story arriving card rounded-corners lifted">
      <Can className="can paragraph bold">{can}</Can>
      <p className="so-that paragraph italic muted-ink">{soThat}</p>
    </hgroup>
    <p className="overview paragraph muted-ink">{slices}</p>
    <ul className="sliced" aria-label="the slices">
      {sliced.map(([slice, station]) =>
        <li className="italic muted-ink" key={slice}>
          <span>{slice}</span>
          <StationLink station={station} at={stationsAt}/>
        </li>)}
    </ul>
  </section>;
};
