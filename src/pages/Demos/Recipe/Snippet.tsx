import {FC, PropsWithChildren} from 'react';
import {has, maybe, not} from '@ryandur/sand';
import {classNames} from '@components';
import {Kind, Label} from './highlight';
import {excerpts} from './excerpts';
import {Line} from './sample';
import './Snippet.css';

type Props = {
  label: Label;
  lines: readonly Line[];
};

type Source = {path: string; url: string; owner?: string; first: number; last: number; fromTheExhibit: boolean};

const sourcesOf = (lines: readonly Line[]): Source[] =>
  lines.reduce<Source[]>((sources, {from}) => maybe(from).map(({file: {path, url, owner}, line, kind}) => {
    const known = sources.find(source => source.path === path);
    return known
      ? sources.map(source => source === known
        ? {
          ...known,
          first: Math.min(known.first, line),
          last: Math.max(known.last, line),
          fromTheExhibit: known.fromTheExhibit && kind === 'exhibit'
        }
        : source)
      : [...sources, {path, url, owner, first: line, last: line, fromTheExhibit: kind === 'exhibit'}];
  }).orElse(sources), []);

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

const FileLink: FC<PropsWithChildren<{href: string}>> = ({href, children}) =>
  <a className="signpost reachable" href={href} target="_blank" rel="noreferrer">{children}</a>;

const linesOnGitHub = ({url, first, last}: Source): string => `${url}#L${first}-L${last}`;

const exhibitFilesSentence = (count: number): string =>
  `Taken from the exhibit on this page. The rest of the site doesn’t use ${count > 1 ? 'them' : 'it'}.`;

export const Snippet: FC<Props> = ({label, lines}) => {
  const sources = sourcesOf(lines);
  const exhibitFiles = sources.filter(({fromTheExhibit}) => fromTheExhibit);
  const sharedFiles = sources.filter(({fromTheExhibit}) => not(fromTheExhibit));
  const indented = lines.map(({text}) => splitIndent(text));
  const inked = excerpts.tokensOf(label, lines.map((line, at) => ({...line, text: indented[at].code})));
  return <figure className="sample">
    <pre className="snippet code-paper-filled code-ink listing rounded-corners monospaced">
      <span className="lang caption uppercase comment-ink" aria-hidden="true">{label}</span>
      <code>{lines.map(({dim = false}, at) => {
        const {indent} = indented[at];
        return <span className={classNames('line', dim && inkOf.comment)} key={at}>
          {has(indent) && <span className="indent">{indent}</span>}
          {inked[at].map(({text: piece, kind}, part) =>
            kind === 'plain' ? piece : <span className={inkOf[kind]} key={part}>{piece}</span>)}
          {'\n'}
        </span>;
      })}</code>
    </pre>
    <figcaption className="sources caption ink">
      {exhibitFiles.map(source => <FileLink href={linesOnGitHub(source)} key={source.path}>
        {nameOf(source.path, source.owner)} on GitHub</FileLink>)}
      {has(exhibitFiles) && exhibitFilesSentence(exhibitFiles.length)}
      {sharedFiles.map(source => <FileLink href={linesOnGitHub(source)} key={source.path}>
        {nameOf(source.path, source.owner)} on GitHub</FileLink>)}
      {not(has(sources)) && 'Written for this page, not taken from the site’s code.'}
    </figcaption>
  </figure>;
};
