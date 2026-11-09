import {FC, MouseEvent, PropsWithChildren, SyntheticEvent} from 'react';
import {not} from '@ryandur/sand';

const lightDismissMissing = (): boolean => not('closedBy' in HTMLDialogElement.prototype);

// Safari has no closedby yet, so there a click on the veil closes the dialog by hand
const closesOnTheVeil = (event: MouseEvent<HTMLDialogElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  const onTheVeil = event.clientX < box.left || event.clientX > box.right
    || event.clientY < box.top || event.clientY > box.bottom;
  if (lightDismissMissing() && event.target === event.currentTarget && onTheVeil) {
    event.currentTarget.close();
  }
};

type ModalProps = PropsWithChildren<{
  id: string;
  labelledBy: string;
  className?: string;
  onToggle?: (event: SyntheticEvent<HTMLDialogElement>) => void;
}>;

const closesInPlaceWhenRemoved = (dialog: HTMLDialogElement) => () => dialog.close();

export const Modal: FC<ModalProps> = ({id, labelledBy, className, onToggle, children}) =>
  <dialog id={id} ref={closesInPlaceWhenRemoved} className={className} closedby="any" aria-labelledby={labelledBy}
    onClick={closesOnTheVeil} onToggle={onToggle}>
    {children}
  </dialog>;
