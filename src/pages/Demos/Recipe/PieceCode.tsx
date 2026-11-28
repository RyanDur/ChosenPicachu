import {FC, PropsWithChildren} from 'react';
import './Snippet.css';

export const PieceCode: FC<PropsWithChildren> = ({children}) =>
  <pre className="snippet code-paper-filled code-ink listing monospaced"><code>{children}</code></pre>;
