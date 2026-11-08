import {Entry, Item, Menu} from '@components/Menu';
import {FC, FocusEvent, KeyboardEvent, useId, useReducer} from 'react';
import {flushSync} from 'react-dom';
import {Maybe, maybe, nothing, some, not} from '@ryandur/sand';
import {sortChoices} from './sort-choices';
import {sortMenu} from './sort-menu';
import {sortMenuChange} from './sort-menu-change';

const steps: Partial<Record<string, (at: number, count: number) => number>> = {
  ArrowDown: (at, count) => (at + 1) % count,
  ArrowUp: (at, count) => (at - 1 + count) % count,
  Home: () => 0,
  End: (_at, count) => count - 1
};

const nextChoice = (key: string, at: number, count: number): Maybe<number> =>
  maybe(steps[key]).map(step => step(at, count));

const focusOn = (element: HTMLElement): void => element.focus();

const choicesBeside = (choice: HTMLElement): HTMLElement[] =>
  maybe(choice.closest('[role="menu"]'))
    .map(menu => [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')])
    .orElse([]);

const firstChoiceAfter = (button: HTMLElement): Maybe<HTMLElement> =>
  maybe(button.nextElementSibling?.querySelector<HTMLElement>('[role="menuitem"]'));

const buttonOf = (choice: HTMLElement): Maybe<HTMLElement> =>
  maybe(choice.closest('[role="menu"]')?.previousElementSibling)
    .mBind(button => button instanceof HTMLElement ? some(button) : nothing());

export const SortMenu: FC<{onOpened: () => void}> = ({onOpened}) => {
  const [{open, chosen}, dispatch] = useReducer(sortMenu.reduce, sortMenu.initial);
  const buttonId = useId();
  const menuId = useId();

  const opens = (button: HTMLElement): void => {
    flushSync(() => dispatch(sortMenuChange.opened()));
    firstChoiceAfter(button).map(focusOn);
    onOpened();
  };
  const closesOnto = (button: HTMLElement): void => {
    focusOn(button);
    dispatch(sortMenuChange.closed());
  };
  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      opens(event.currentTarget);
    }
  };
  const onChoiceKey = (at: number) => (event: KeyboardEvent<HTMLButtonElement>): void => {
    const choice = event.currentTarget;
    if (event.key === 'Escape') {
      buttonOf(choice).map(closesOnto);
      return;
    }
    nextChoice(event.key, at, sortChoices.all.length).map(next => {
      event.preventDefault();
      maybe(choicesBeside(choice)[next]).map(focusOn);
    });
  };
  const onListBlur = ({currentTarget, relatedTarget}: FocusEvent<HTMLMenuElement>): void => {
    if (not(relatedTarget instanceof Node && currentTarget.contains(relatedTarget))) {
      dispatch(sortMenuChange.closed());
    }
  };

  const words = sortChoices.byWords(chosen);

  return <>
    <button id={buttonId} type="button" className="button primary reachable" aria-haspopup="menu" aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      aria-label={`${words}, the old way`}
      onMouseDown={event => event.preventDefault()}
      onClick={({currentTarget}) => open ? closesOnto(currentTarget) : opens(currentTarget)}
      onKeyDown={onButtonKey}>{words}</button>
    {open && <Menu id={menuId} role="menu" aria-labelledby={buttonId} className="sort-choices card rounded-corners lifted" onBlur={onListBlur}>
      {sortChoices.all.map((choice, at) =>
        <Entry key={choice} role="none">
          <Item role="menuitem" tabIndex={-1} className="sub-title reachable"
            aria-current={chosen.map(picked => picked === choice).orElse(false)}
            onClick={({currentTarget}) => {
              buttonOf(currentTarget).map(focusOn);
              dispatch(sortMenuChange.chosen(choice));
            }}
            onKeyDown={onChoiceKey(at)}>{choice}</Item>
        </Entry>)}
    </Menu>}
  </>;
};
