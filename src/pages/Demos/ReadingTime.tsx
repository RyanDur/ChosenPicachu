import {FC} from 'react';

export const ReadingTime: FC<{minutes: number}> = ({minutes}) =>
  <p className="caption muted-ink">
    <time dateTime={`PT${minutes}M`}>{`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} to read`}</time>
  </p>;
