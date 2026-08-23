import {FC, PropsWithChildren, ReactNode, useId, useState} from 'react';
import {has} from '@ryandur/sand';

const definitionOf = (id: string): HTMLElement | undefined => {
  const element = document.getElementById(id);
  return element instanceof HTMLElement ? element : undefined;
};

const revealed = (id: string): void => {
  const definition = definitionOf(id);
  if (has(definition) && typeof definition.showPopover === 'function' && !definition.matches(':popover-open')) {
    definition.showPopover();
  }
};

const concealed = (id: string): void => {
  const definition = definitionOf(id);
  if (has(definition) && typeof definition.hidePopover === 'function' && definition.matches(':popover-open')) {
    definition.hidePopover();
  }
};

export const Defined: FC<PropsWithChildren<{definition: ReactNode}>> = ({definition, children}) => {
  const anchor = `--term-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const id = `definition${anchor}`;
  const [intent, setIntent] = useState<number>();
  return <>
    <button type="button"
            className="term"
            popoverTarget={id}
            style={{'--term-anchor': anchor}}
            onMouseEnter={() => setIntent(window.setTimeout(() => revealed(id), 120))}
            onMouseLeave={() => {
              window.clearTimeout(intent);
              concealed(id);
            }}
            onFocus={() => revealed(id)}
            onBlur={() => concealed(id)}>{children}</button>
    <span id={id}
          popover="auto"
          className="term-definition card rounded-corners lifted"
          style={{'--term-anchor': anchor}}>{definition}</span>
  </>;
};
