import {FC} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Kind, highlight} from './highlight';
import {CodeFile} from './sample';
import './Snippet.css';

export type Line = {
  text: string;
  dim?: boolean;
  from?: {file: CodeFile; line: number};
};

type Props = {
  label: 'HTML' | 'CSS' | 'TS';
  lines: readonly Line[];
};

type Source = {path: string; url: string; owner?: string; first: number; last: number};

const sourcesOf = (lines: readonly Line[]): Source[] =>
  lines.reduce<Source[]>((sources, {from}) => {
    if (from) {
      const {file: {path, url, owner}, line} = from;
      const known = sources.find(source => source.path === path);
      return known
        ? sources.map(source => source === known
          ? {...known, first: Math.min(known.first, line), last: Math.max(known.last, line)}
          : source)
        : [...sources, {path, url, owner, first: line, last: line}];
    }
    return sources;
  }, []);

const roots = ['src', 'lib'];

const shortName = (path: string): string => {
  const [file, folder, parent] = path.split('/').reverse();
  const insideAComponent = /^[a-z]/.test(folder) && has(parent) && not(roots.includes(parent));
  return (insideAComponent ? [parent, folder, file] : [folder, file]).join('/');
};

const nameOf = (path: string, owner?: string): string => has(owner) ? `${owner}’s ${shortName(path)}` : shortName(path);

const splitIndent = (text: string): {indent: string; code: string} => {
  const code = text.trimStart();
  return {indent: text.slice(0, text.length - code.length), code};
};

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
    <pre className="snippet code-paper-filled code-ink listing rounded-corners monospaced">
      <span className="lang caption uppercase comment-ink" aria-hidden="true">{label}</span>
      <code>{lines.map(({text, dim = false}, at) => {
        const {indent, code} = splitIndent(text);
        return <span className={classNames('line', dim && inkOf.comment)} key={at}>
          {has(indent) && <span className="indent">{indent}</span>}
          {dim
            ? code
            : highlight(label, code).map(({text: piece, kind}, part) =>
              kind === 'plain' ? piece : <span className={inkOf[kind]} key={part}>{piece}</span>)}
          {'\n'}
        </span>;
      })}</code>
    </pre>
    <figcaption className="sources caption ink">
      {sources.length > 0
        ? sources.map(({path, url, owner, first, last}) =>
          <a className="signpost reachable" href={`${url}#L${first}-L${last}`} target="_blank" rel="noreferrer"
            key={path}>{nameOf(path, owner)} on GitHub</a>)
        : 'Written for this page, not taken from the site’s code.'}
    </figcaption>
  </figure>;
};
