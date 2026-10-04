import {FC} from 'react';
import {classNames} from '@components/class-names';
import {highlight} from './highlight';
import {Sample} from './sample';
import './Snippet.css';

export type Line = {
  text: string;
  dim?: boolean;
  from?: Sample;
};

type Props = {
  label: 'HTML' | 'CSS' | 'TS';
  lines: readonly Line[];
};

const sourcesOf = (lines: readonly Line[]): Sample[] =>
  lines.flatMap(({from}) => from ? [from] : [])
    .filter((sample, at, all) => all.findIndex(({path}) => path === sample.path) === at);

const shortName = (path: string): string => path.split('/').slice(-2).join('/');

export const Snippet: FC<Props> = ({label, lines}) => {
  const sources = sourcesOf(lines);
  return <figure className="sample">
    <pre className={classNames('snippet', 'code', 'rounded-corners')}>
      <span className="lang" aria-hidden="true">{label}</span>
      <code>{lines.map(({text, dim = false}, at) =>
        <span className={classNames('line', dim && 'comment')} key={at}>
          {dim
            ? text
            : highlight(label, text).map(({text: piece, kind}, part) =>
              kind === 'plain' ? piece : <span className={kind} key={part}>{piece}</span>)}
          {'\n'}
        </span>)}</code>
    </pre>
    <figcaption className="sources">
      {sources.length > 0
        ? sources.map(({path, url}) =>
          <a className="signpost reachable" href={url} target="_blank" rel="noreferrer" key={path}>{shortName(path)} on GitHub</a>)
        : 'Written for this page, not taken from the site’s code.'}
    </figcaption>
  </figure>;
};
