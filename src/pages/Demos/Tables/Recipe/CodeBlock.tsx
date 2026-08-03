import {FC} from 'react';

type Props = {
  code: string;
};

export const CodeBlock: FC<Props> = ({code}) =>
  <pre className="code-block"><code>{code}</code></pre>;
