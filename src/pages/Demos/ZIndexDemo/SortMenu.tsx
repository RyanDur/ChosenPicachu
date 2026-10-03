import {FC, FocusEvent, KeyboardEvent, useEffect, useId, useState} from 'react';

const choices = ['name', 'date', 'size'] as const;

type Choice = typeof choices[number];

const focusOn = (choice: Element | null | undefined): void => {
  if (choice instanceof HTMLElement) {
    choice.focus();
  }
};

const choiceIn = (item: Element | null | undefined): Element | null | undefined => item?.firstElementChild;

const movesFocus: Partial<Record<string, (item: Element | null) => void>> = {
  ArrowDown: item => focusOn(choiceIn(item?.nextElementSibling ?? item?.parentElement?.firstElementChild)),
  ArrowUp: item => focusOn(choiceIn(item?.previousElementSibling ?? item?.parentElement?.lastElementChild)),
  Home: item => focusOn(choiceIn(item?.parentElement?.firstElementChild)),
  End: item => focusOn(choiceIn(item?.parentElement?.lastElementChild))
};

export const SortMenu: FC = () => {
  const [open, updateOpen] = useState(false);
  const [chosen, updateChosen] = useState<Choice>();
  const button = useId();
  const list = useId();

  useEffect(() => {
    if (open) {
      focusOn(document.getElementById(list)?.querySelector('[role="menuitem"]'));
    }
  }, [open, list]);

  const closeToButton = (): void => {
    updateOpen(false);
    focusOn(document.getElementById(button));
  };
  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      updateOpen(true);
    }
  };
  const onChoiceKey = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const move = movesFocus[event.key];
    if (move) {
      event.preventDefault();
      move(event.currentTarget.parentElement);
    } else if (event.key === 'Escape') {
      closeToButton();
    }
  };
  const onListBlur = (event: FocusEvent<HTMLUListElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget?.id !== button) {
      updateOpen(false);
    }
  };

  return <>
    <button id={button} type="button" className="button primary reachable" aria-haspopup="menu" aria-expanded={open} aria-controls={list}
      onClick={() => updateOpen(!open)} onKeyDown={onButtonKey}>{chosen ? `Sort by: ${chosen}` : 'Sort by'}</button>
    {open && <ul id={list} role="menu" aria-labelledby={button} className="sort-choices card rounded-corners floating" onBlur={onListBlur}>
      {choices.map(choice =>
        <li key={choice} role="none">
          <button type="button" role="menuitem" tabIndex={-1} className="sort-choice reachable"
            onClick={() => {
              updateChosen(choice);
              closeToButton();
            }}
            onKeyDown={onChoiceKey}>{choice}</button>
        </li>)}
    </ul>}
  </>;
};
