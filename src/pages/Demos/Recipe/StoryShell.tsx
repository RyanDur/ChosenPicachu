import {Children, FC, isValidElement, MouseEvent, PropsWithChildren, ReactNode, SyntheticEvent} from 'react';
import {StoryCard} from './StoryCard';
import {Steps} from './Steps';

const stepsIn = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (isValidElement<PropsWithChildren>(child)) {
      return child.type === Steps
        ? count + Children.toArray(child.props.children).filter(isValidElement).length
        : count + stepsIn(child.props.children);
    }
    return count;
  }, 0);

export type Titled = PropsWithChildren<{titleId: string; can: string; soThat: string}>;

type Folding = {
  open: boolean;
  onToggle?: (event: SyntheticEvent<HTMLDetailsElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export const StoryShell: FC<Titled & Folding> = ({titleId, can, soThat, children, open, onToggle, onClick}) =>
  <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId} onToggle={onToggle}>
      <summary className="fold-bar sub-title-glyph-before" onClick={onClick}>
        <StoryCard titleId={titleId} can={can} soThat={soThat} steps={stepsIn(children)}/>
      </summary>
      {children}
    </details>
  </li>;
