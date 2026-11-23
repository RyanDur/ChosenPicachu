import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {useListedParts} from './useListedParts';
import {PartsIndexEntry} from './PartsIndexEntry';
import {PartsIndexGroup} from './PartsIndexGroup';
import {PartsIndexLink} from './PartsIndexLink';
import {PartsEntry, partsListed} from './parts-listed';

const entryKey = ({to, heading}: Pick<PartsEntry, 'to' | 'heading'>): string => `${to}${maybe(heading).orElse('')}`;

export const PartsList: FC = () => {
  const groups = useListedParts();
  return groups.map(({label, entries}, at) => {
    const start = partsListed.startOf(groups, at);
    const items = entries.map(({to, heading, name, minutes, says}) => <PartsIndexEntry key={entryKey({to, heading})}>
      <PartsIndexLink to={to} heading={heading}>{name}</PartsIndexLink>
      <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
      <p className="says paragraph">{says}</p>
    </PartsIndexEntry>);
    return maybe(label).either(
      labeled => <PartsIndexGroup key={labeled} label={labeled} start={start}>{items}</PartsIndexGroup>,
      () => <ol key={start} className="parts-index-list numbered" start={start}>{items}</ol>);
  });
};
