import {FC} from 'react';
import {Link} from 'react-router';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {useCarriedAddress} from './useCarriedAddress';
import './PartFoot.css';

export type Beside = {kind: 'part'; title: string; address: string} | {kind: 'tab'; topic: DemoTopics};
export type Behind = Beside | {kind: 'first-part'};
export type Onward = Beside | {kind: 'last-part-said'} | {kind: 'last-part-unsaid'};

const PreviousSide: FC<{behind: Behind}> = ({behind}) => {
  const carried = useCarriedAddress();
  switch (behind.kind) {
    case 'part':
      return <Link className="reachable signpost" rel="prev" to={behind.address}>{`Previous: ${behind.title}`}</Link>;
    case 'tab':
      return <Link className="reachable signpost" rel="prev" to={carried(demoTab.address(behind.topic))}>
        {`Previous tab: ${demoTab.names[behind.topic]}`}
      </Link>;
    case 'first-part':
      return null;
  }
};

const NextSide: FC<{onward: Onward}> = ({onward}) => {
  const carried = useCarriedAddress();
  switch (onward.kind) {
    case 'part':
      return <Link className="onward reachable signpost" rel="next" to={onward.address}>{`Next: ${onward.title}`}</Link>;
    case 'tab':
      return <Link className="onward reachable signpost" rel="next" to={carried(demoTab.address(onward.topic))}>
        {`Next tab: ${demoTab.names[onward.topic]}`}
      </Link>;
    case 'last-part-said':
      return <p className="onward">This is the last part.</p>;
    case 'last-part-unsaid':
      return null;
  }
};

export const PartFoot: FC<{previous: Behind; next: Onward}> = ({previous, next}) =>
  <nav className="part-foot silver-rule-above" aria-label="Parts, in order">
    <PreviousSide behind={previous}/>
    <NextSide onward={next}/>
  </nav>;
