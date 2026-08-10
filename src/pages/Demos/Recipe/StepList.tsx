import {FC, MouseEvent, ReactNode} from 'react';
import {useSearchParams} from 'react-router';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Line, Snippet} from './Snippet';

export type Block = {
  label: 'HTML' | 'CSS' | 'JS';
  lines: Line[];
  foil?: boolean;
};

export type StepEntry = {
  title: string;
  want: ReactNode;
  says: ReactNode[];
  dial?: ReactNode;
  figure?: ReactNode;
  code: Block[];
};

export {aside, plain} from './lines';

export type StoryEntry = {
  id: string;
  can: string;
  soThat: string;
  tells?: ReactNode[];
  steps: StepEntry[];
};

const openedIn = (params: URLSearchParams, param: string): Set<string> =>
  new Set((params.get(param) ?? '').split(',').filter(part => part !== ''));

export const StoryList: FC<{stories: StoryEntry[]; param: string}> = ({stories, param}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const opened = openedIn(searchParams, param);
  const toggled = (story: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSearchParams(previous => {
      const next = openedIn(previous, param);
      if (next.has(story)) {
        next.delete(story);
      } else {
        next.add(story);
      }
      const params = new URLSearchParams(previous);
      if (next.size > 0) {
        params.set(param, [...next].join(','));
      } else {
        params.delete(param);
      }
      return params;
    }, {replace: true});
  };
  return <ol className="arcs">
    {stories.map(story =>
      <li key={story.id}>
        <details className="arc" open={opened.has(story.id)}>
          <summary className="opener" onClick={toggled(story.id)}>
            <hgroup className="story">
              <h3 className="can">{story.can}</h3>
              <p className="so-that">so that {story.soThat}</p>
            </hgroup>
          </summary>
          {story.tells?.map((paragraph, tale) =>
            <p className="approach" key={tale}>{paragraph}</p>)}
          <StepList steps={story.steps}/>
        </details>
      </li>)}
  </ol>;
};

export const StepList: FC<{steps: StepEntry[]}> = ({steps}) =>
  <ol className="steps">
    {steps.map(step =>
      <li className={classNames('step', has(step.dial) && 'tuned')} key={step.title}>
        <article className="step-body">
          <header className="step-heading">
            <h3 className="step-title">{step.title}</h3>
            {step.dial}
          </header>
          <div className="step-words">
            <p className="step-want">{step.want}</p>
            {step.says.map((paragraph, at) => <p className="step-says" key={at}>{paragraph}</p>)}
            {step.figure}
          </div>
          <div className="step-code">
            {step.code.map(({label, lines, foil}, at) => <Snippet label={label} lines={lines} foil={foil} key={at}/>)}
          </div>
        </article>
      </li>)}
  </ol>;
