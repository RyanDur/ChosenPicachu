import {FC, PropsWithChildren} from 'react';
import {has, maybe, not} from '@ryandur/sand';
import {Label} from './highlight';
import {Line} from './sample';
import {InkedLines} from './InkedLines';
import {fileNames} from './fileNames';
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

const FileLink: FC<PropsWithChildren<{href: string}>> = ({href, children}) =>
  <a className="signpost reachable" href={href} target="_blank" rel="noreferrer">{children}</a>;

const linesOnGitHub = ({url, first, last}: Source): string => `${url}#L${first}-L${last}`;

export const Snippet: FC<Props> = ({label, lines}) => {
  const sources = sourcesOf(lines);
  const exhibitFiles = sources.filter(({fromTheExhibit}) => fromTheExhibit);
  const sharedFiles = sources.filter(({fromTheExhibit}) => not(fromTheExhibit));
  return <figure className="sample">
    <pre className="snippet code-paper-filled code-ink listing rounded-corners monospaced">
      <span className="lang caption uppercase comment-ink" aria-hidden="true">{label}</span>
      <code><InkedLines label={label} lines={lines}/></code>
    </pre>
    <figcaption className="sources caption ink">
      {exhibitFiles.map(source => <FileLink href={linesOnGitHub(source)} key={source.path}>
        {fileNames.of(source.path, source.owner)} on GitHub</FileLink>)}
      {has(exhibitFiles) && <p>Taken from the exhibit on this page.</p>}
      {sharedFiles.map(source => <FileLink href={linesOnGitHub(source)} key={source.path}>
        {fileNames.of(source.path, source.owner)} on GitHub</FileLink>)}
      {not(has(sources)) && 'Written for this page, not taken from the site’s code.'}
    </figcaption>
  </figure>;
};
