import {ButtonHTMLAttributes, FC} from 'react';

type ModalOpenerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'command' | 'commandfor'> & {
  modal?: string;
};

export const ModalOpener: FC<ModalOpenerProps> = ({modal, children, ...button}) =>
  <button type="button" commandfor={modal} command="show-modal" {...button}>{children}</button>;
