import {FC, PropsWithChildren, ReactNode, useId, useState} from 'react';
import {Maybe, maybe} from '@ryandur/sand';

type Intent = ReturnType<typeof setTimeout>;

const definitionOf = (term: HTMLButtonElement): Maybe<HTMLElement> =>
  maybe(term.popoverTargetElement).mBind(target => maybe(target instanceof HTMLElement ? target : undefined));

const revealed = (term: HTMLButtonElement): void => {
  definitionOf(term).map(definition => !definition.matches(':popover-open') && definition.showPopover());
};

const concealed = (term: HTMLButtonElement): void => {
  definitionOf(term).map(definition => definition.matches(':popover-open') && definition.hidePopover());
};

export const Defined: FC<PropsWithChildren<{term: string; definition: ReactNode}>> = ({term, definition, children}) => {
  const anchor = `--term-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const id = `definition${anchor}`;
  const [intent, setIntent] = useState<Intent>();
  return <>
    <button type="button"
      className="term borderless unfilled dotted-underlined focus-ringed"
      popoverTarget={id}
      popoverTargetAction="show"
      style={{'--term-anchor': anchor}}
      onPointerEnter={({pointerType, currentTarget}) => {
        if (pointerType === 'mouse') setIntent(setTimeout(() => revealed(currentTarget), 120));
      }}
      onPointerLeave={({pointerType, currentTarget}) => {
        if (pointerType !== 'mouse') return;
        clearTimeout(intent);
        concealed(currentTarget);
      }}
      onFocus={({currentTarget}) => {
        clearTimeout(intent);
        revealed(currentTarget);
      }}
      onBlur={({currentTarget}) => concealed(currentTarget)}>{children}</button>
    <span id={id}
      role="definition"
      aria-label={term}
      popover="auto"
      className="term-definition card rounded-corners lifted paragraph"
      style={{'--term-anchor': anchor}}
      onToggle={() => clearTimeout(intent)}>{definition}</span>
  </>;
};
