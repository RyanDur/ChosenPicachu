import {FC} from 'react';
import {join} from '@components/class-names';

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
      <span className={join('line', dim && 'aside')} key={at}>{text}</span>)}</code>
  </pre>;
