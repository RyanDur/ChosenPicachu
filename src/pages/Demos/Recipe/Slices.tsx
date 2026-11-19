import {PartLink} from '@pages/Demos/ZIndexDemo';
import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {Place, useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {stations, storiesHeading} from '@pages/Demos/headings';

type Slice = [slice: string, station: number];

type PlacedSlice = [slice: string, part: number, place: Place];

type OnTheTab = {
  partPage?: never;
  sliced: Slice[];
};

type OnAPartPage = {
  partPage: {headedBy: string};
  sliced: PlacedSlice[];
};

type SlicesProps = {
  can: string;
  soThat: string;
  slices: ReactNode;
} & (OnTheTab | OnAPartPage);

const SliceLink: FC<{at: number; place?: Place}> = ({at, place}) => {
  const carried = useCarriedAddress();
  return maybe(place).either(
    ({to, heading}) =>
      <Link className="slice-station signpost caption upright" to={carried(to, heading)}>part {at}</Link>,
    () => <a className="slice-station signpost caption upright" href={`#${stations.idOf(at)}`}>station {at}</a>);
};

export const Slices: FC<SlicesProps> = ({can, soThat, slices, sliced, partPage}) => {
  const placed: [string, number, Place?][] = sliced;
  const Can: 'h3' | 'h4' = maybe(partPage).either(() => 'h3', () => 'h4');
  return <section className="phase card rounded-corners lifted"
    aria-labelledby={maybe(partPage).map(({headedBy}) => headedBy).orElse(storiesHeading.id)}>
    {maybe(partPage).either(
      () => null,
      () => <h3 id={storiesHeading.id} className="phase-title title">{storiesHeading.title}</h3>)}
    <p className="overview paragraph muted-ink">
      Once the need is heard and the design has answered shape, I split the work into stories. Each is
      a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a card, a conversation and a confirmation, as taught in the z-index
      part <PartLink part="lets-build-this-feature"/>. The whole of it reads as one:
    </p>
    <hgroup className="story arriving card rounded-corners lifted">
      <Can className="can paragraph bold">{can}</Can>
      <p className="so-that paragraph italic muted-ink">{soThat}</p>
    </hgroup>
    <p className="overview paragraph muted-ink">{slices}</p>
    <ul className="sliced" aria-label="the slices">
      {placed.map(([slice, at, place]) =>
        <li className="italic muted-ink" key={slice}>
          <span>{slice}</span>
          <SliceLink at={at} place={place}/>
        </li>)}
    </ul>
  </section>;
};
