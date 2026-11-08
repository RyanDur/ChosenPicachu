import {ComponentProps, FC} from 'react';
import {Link} from 'react-router';
import {classNames} from '../classNames';

export const ItemLink: FC<ComponentProps<typeof Link>> = ({className, ...link}) =>
  <Link {...link}
    className={classNames('item', className, 'unfilled', 'borderless', 'muted-rule-below', 'shadow-ringed', 'soft-press-glowing')}/>;
