import {FC} from 'react';
import {zIndexParts} from './part-pages';

export const ZIndexSize: FC = () =>
  <p className="paragraph">{`Six parts, about ${zIndexParts.minutes} minutes.`}</p>;
