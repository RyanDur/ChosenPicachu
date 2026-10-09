import {Entry, Item, Menu} from '@components/Menu';
import {FC, FocusEvent, KeyboardEvent, useEffect, useId, useState} from 'react';
import {Maybe, maybe, nothing, some} from '@ryandur/sand';
import {SortChoice, sortChoices, sortByWords} from './sort-choices';

const steps: Partial<Record<string, (at: number, count: number) => number>> = {
  ArrowDown: (at, count) => (at + 1) % count,
  ArrowUp: (at, count) => (at - 1 + count) % count,
  Home: () => 0,
  End: (_at, count) => count - 1
};

const nextChoice = (key: string, at: number, count: number): Maybe<number> => maybe(steps[key]).map(step => step(at, count));

const focusOn = (element: HTMLElement): void => element.focus();

const elementWithId = (id: string): Maybe<HTMLElement> => maybe(document.getElementById(id));

const choiceAt = (list: string, at: number): Maybe<HTMLElement> => elementWithId(list).mBind(menu => {
  const choice = menu.querySelectorAll('[role="menuitem"]').item(at);
  return choice instanceof HTMLElement ? some(choice) : nothing();
});

const within = (target: EventTarget | null, id: string): boolean => target instanceof Node &&
  elementWithId(id).map(part => part.contains(target)).orElse(false);

export const SortMenu: FC<{onOpened: () => void}> = ({onOpened}) => {
  const [open, updateOpen] = useState(false);
  const [chosen, updateChosen] = useState<Maybe<SortChoice>>(nothing());
  const button = useId();
  const list = useId();

  useEffect(() => {
    if (open) {
      choiceAt(list, 0).map(focusOn);
    }
  }, [open, list]);

  const opens = (): void => {
    updateOpen(true);
    onOpened();
  };
  const closeToButton = (): void => {
    updateOpen(false);
    elementWithId(button).map(focusOn);
  };
  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      opens();
    }
  };
  const onChoiceKey = (at: number) => (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Escape') {
      closeToButton();
      return;
    }
    nextChoice(event.key, at, sortChoices.length).map(next => {
      event.preventDefault();
      choiceAt(list, next).map(focusOn);
    });
  };
  const onListBlur = ({relatedTarget}: FocusEvent<HTMLUListElement>): void => {
    if (!within(relatedTarget, list)) {
      updateOpen(false);
    }
  };

  const words = sortByWords(chosen);

  return <>
    <button id={button} type="button" className="button primary reachable" aria-haspopup="menu" aria-expanded={open} aria-controls={list}
      aria-label={`${words}, the old way`}
      onMouseDown={event => event.preventDefault()} onClick={() => open ? closeToButton() : opens()} onKeyDown={onButtonKey}>{words}</button>
    {open && <Menu id={list} role="menu" aria-labelledby={button} className="sort-choices card rounded-corners lifted" onBlur={onListBlur}>
      {sortChoices.map((choice, at) =>
        <Entry key={choice} role="none">
          <Item role="menuitem" tabIndex={-1} className="sub-title reachable"
            aria-current={chosen.map(picked => picked === choice).orElse(false)}
            onClick={() => {
              updateChosen(some(choice));
              closeToButton();
            }}
            onKeyDown={onChoiceKey(at)}>{choice}</Item>
        </Entry>)}
    </Menu>}
  </>;
};
