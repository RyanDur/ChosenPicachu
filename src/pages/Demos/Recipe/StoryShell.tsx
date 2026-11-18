import {Children, FC, isValidElement, PropsWithChildren, ReactNode} from 'react';
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

export const StoryShell: FC<Titled & {open?: boolean}> = ({titleId, can, soThat, children, open}) =>
  <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId}>
      <summary className="fold-bar sub-title-glyph-before">
        <StoryCard titleId={titleId} can={can} soThat={soThat} steps={stepsIn(children)}/>
      </summary>
      {children}
    </details>
  </li>;
