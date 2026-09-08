import {ComponentProps, FC} from 'react';
import {useTableSelector} from './context';
import {selectStanding} from './selectors';
import {placed} from './placing';

export const Body: FC<ComponentProps<'tbody'>> = ({children, ...tbody}) => {
  const standing = useTableSelector(selectStanding);

  return <tbody {...tbody}>{placed(children, standing, 'row')}</tbody>;
};
