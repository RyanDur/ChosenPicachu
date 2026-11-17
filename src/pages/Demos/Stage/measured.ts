import {Maybe} from '@ryandur/sand';

export const measured = <Change>(
  body: Maybe<HTMLElement>,
  dispatch: (change: Change) => void,
  grown: (height: number) => Change
): void => {
  body.map(inner => {
    const height = Math.ceil(inner.getBoundingClientRect().height);
    if (height > 0) {
      dispatch(grown(height));
    }
  });
};
