import {FC, PropsWithChildren} from 'react';

export const Predict: FC<PropsWithChildren> = ({children}) =>
  <p className="step-predict paragraph">
    <strong className="uppercase">before you read on:</strong> {children}
  </p>;
