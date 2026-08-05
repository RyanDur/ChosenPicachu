import {FC} from 'react';
import {join} from '@components/class-names';
import {highlight} from './highlight';

export type Line = {
  text: string;
  dim?: boolean;
};

type Props = {
  label: 'HTML' | 'CSS' | 'JS';
  lines: readonly Line[];
};

export const Snippet: FC<Props> = ({label, lines}) =>
  <pre className="snippet">
    <span className="lang" aria-hidden="true">{label}</span>
    <code>{lines.map(({text, dim}, at) =>
      <span className={join('line', dim && 'aside')} key={at}>
        {dim
          ? text
          : highlight(label, text).map(({text: piece, kind}, part) =>
            kind === 'plain' ? piece : <span className={kind} key={part}>{piece}</span>)}
      </span>)}</code>
  </pre>;
