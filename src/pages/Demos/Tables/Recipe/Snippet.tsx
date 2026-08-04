import {FC} from 'react';
import {join} from '@components/class-names';

export type Line = {
  text: string;
  dim?: boolean;
};

type Props = {
  lines: readonly Line[];
};

export const Snippet: FC<Props> = ({lines}) =>
  <pre className="snippet"><code>{lines.map(({text, dim}, at) =>
    <span className={join('line', dim && 'aside')} key={at}>{text}</span>)}</code></pre>;
