import {FC, PropsWithChildren} from 'react';

export const PeriodSample: FC<PropsWithChildren<{name: string}>> = ({name, children}) =>
  <pre className="period-markup card rounded-corners hairline-edged caption monospaced focus-ringed" tabIndex={0}
    role="group"
    aria-label={name}><code>{children}</code></pre>;
