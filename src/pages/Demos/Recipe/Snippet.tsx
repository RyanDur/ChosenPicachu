import {FC} from 'react';
import {classNames} from '@components/class-names';
import {highlight} from './highlight';

export type Line = {
  text: string;
  dim?: boolean;
};

type Props = {
  label: 'HTML' | 'CSS' | 'JS';
  lines: readonly Line[];
  foil?: boolean;
};

export const Snippet: FC<Props> = ({label, lines, foil}) =>
  // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- overflowing code scrolls; axe scrollable-region-focusable requires keyboard reach
  <pre className={classNames('snippet', foil && 'foil')} tabIndex={0}>
    <span className="lang" aria-hidden="true">{label}</span>
    <code>{lines.map(({text, dim}, at) =>
      <span className={classNames('line', dim && 'comment')} key={at}>
        {dim
          ? text
          : highlight(label, text).map(({text: piece, kind}, part) =>
            kind === 'plain' ? piece : <span className={kind} key={part}>{piece}</span>)}
      </span>)}</code>
  </pre>;
