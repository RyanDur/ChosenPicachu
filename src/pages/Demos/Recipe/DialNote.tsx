import {FC} from 'react';

export const DialNote: FC<{reads: string}> = ({reads}) =>
  <p className="overview paragraph">
    The dials change which {reads} you are reading about. Eager, Lazy, Keep, Hide, Animate,
    and Static are this page’s names for the choices, not platform keywords, and where a step
    depends on a dial, that dial sits on the step.
  </p>;
