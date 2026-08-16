import {FC} from 'react';
import {classNames} from '@components/class-names';
import {highlight} from './highlight';

export type Line = {
  text: string;
  dim?: boolean;
};

type Props = {
  label: 'HTML' | 'CSS' | 'TS';
  lines: readonly Line[];
  foil?: boolean;
};

export const Snippet: FC<Props> = ({label, lines, foil}) =>
  <pre className={classNames('snippet', foil && 'foil', 'code', 'rounded-corners')}>
    <span className="lang" aria-hidden="true">{label}</span>
    {foil && <strong className="wrong-way uppercase">the wrong way</strong>}
    <code>{lines.map(({text, dim}, at) =>
      <span className={classNames('line', dim && 'comment')} key={at}>
        {dim
          ? text
          : highlight(label, text).map(({text: piece, kind}, part) =>
            kind === 'plain' ? piece : <span className={kind} key={part}>{piece}</span>)}
      </span>)}</code>
  </pre>;
