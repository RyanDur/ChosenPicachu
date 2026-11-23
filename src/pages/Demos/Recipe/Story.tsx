import {Children, FC, isValidElement, PropsWithChildren, ReactNode} from 'react';
import {Steps} from './Steps';
import {useRanks} from './useRanks';

const stepsIn = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (isValidElement<PropsWithChildren>(child)) {
      return child.type === Steps
        ? count + Children.toArray(child.props.children).filter(isValidElement).length
        : count + stepsIn(child.props.children);
    }
    return count;
  }, 0);

type Told = PropsWithChildren<{titleId: string; can: string; soThat: string; open?: boolean}>;

export const Story: FC<Told> = ({titleId, can, soThat, children, open}) => {
  const {story: Can} = useRanks();
  const steps = stepsIn(children);
  return <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId}>
      <summary className="fold-bar sub-title-glyph-before">
        <hgroup className="story card rounded-corners lifted">
          <Can className="can paragraph bold" id={titleId}>{can}</Can>
          <p className="so-that paragraph italic muted-ink">so that {soThat}</p>
          {steps > 0 && <p className="step-tally caption muted-ink">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
        </hgroup>
      </summary>
      {children}
    </details>
  </li>;
};
