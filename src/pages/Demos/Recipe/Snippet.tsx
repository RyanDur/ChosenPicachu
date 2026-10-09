import {FC} from 'react';
import {classNames} from '@components/class-names';
import {Kind, highlight} from './highlight';
import {Sample} from './sample';
import './Snippet.css';

export type Line = {
  text: string;
  dim?: boolean;
  from?: {sample: Sample; line: number};
};

type Props = {
  label: 'HTML' | 'CSS' | 'TS';
  lines: readonly Line[];
};

type Source = {path: string; url: string; first: number; last: number};

const sourcesOf = (lines: readonly Line[]): Source[] =>
  lines.reduce<Source[]>((sources, {from}) => {
    if (from) {
      const {sample: {path, url}, line} = from;
      const known = sources.find(source => source.path === path);
      return known
        ? sources.map(source => source === known
          ? {...known, first: Math.min(known.first, line), last: Math.max(known.last, line)}
          : source)
        : [...sources, {path, url, first: line, last: line}];
    }
    return sources;
  }, []);

const shortName = (path: string): string => path.split('/').slice(-2).join('/');

const inkOf: Record<Exclude<Kind, 'plain'>, string> = {
  keyword: 'keyword-ink bold',
  string: 'string-ink',
  number: 'number-ink',
  comment: 'comment-ink italic',
  tag: 'tag-ink',
  attribute: 'attribute-ink',
  type: 'type-ink',
  call: 'call-ink'
};

export const Snippet: FC<Props> = ({label, lines}) => {
  const sources = sourcesOf(lines);
  return <figure className="sample">
    <pre className={classNames('snippet', 'code-paper-filled', 'code-ink', 'listing', 'rounded-corners')}>
      <span className="lang caption uppercase comment-ink" aria-hidden="true">{label}</span>
      <code>{lines.map(({text, dim = false}, at) =>
        <span className={classNames('line', dim && inkOf.comment)} key={at}>
          {dim
            ? text
            : highlight(label, text).map(({text: piece, kind}, part) =>
              kind === 'plain' ? piece : <span className={inkOf[kind]} key={part}>{piece}</span>)}
          {'\n'}
        </span>)}</code>
    </pre>
    <figcaption className="sources caption ink">
      {sources.length > 0
        ? sources.map(({path, url, first, last}) =>
          <a className="signpost reachable" href={`${url}#L${first}-L${last}`} target="_blank" rel="noreferrer"
            key={path}>{shortName(path)} on GitHub</a>)
        : 'Written for this page, not taken from the site’s code.'}
    </figcaption>
  </figure>;
};
