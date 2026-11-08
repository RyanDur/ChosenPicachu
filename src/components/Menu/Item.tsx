import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';

export const Item: FC<Omit<ComponentProps<'button'>, 'type'>> = ({className, ...button}) =>
  <button {...button} type="button"
    className={classNames('item', className, 'unfilled', 'borderless', 'muted-rule-below', 'shadow-ringed', 'soft-press-glowing')}/>;
