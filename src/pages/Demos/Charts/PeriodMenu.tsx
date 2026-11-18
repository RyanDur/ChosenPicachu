import {Entry, Item, Menu} from '@components/Menu';
import {FC} from 'react';
import {not} from '@ryandur/sand';
import {useHydrated} from '@components';
import {Period} from '../Market';
import {PeriodChartKind} from './chart-kinds';
import {useDesk} from './useDesk';

const spoken: Record<PeriodChartKind, string> = {price: 'price', candles: 'candle'};

type Props = {
  id: string;
  kind: PeriodChartKind;
};

export const PeriodMenu: FC<Props> = ({id, kind}) => {
  const {periodOf, choosePeriod} = useDesk();
  const period = periodOf(kind);
  const hydrated = useHydrated();
  return <>
    <button type="button" className="period-toggle rounded-corners field borderless attentive smoked-while-disabled focus-ringed caption reachable"
      popoverTarget={id} disabled={not(hydrated)}>
      <span className="off-screen">{`${spoken[kind]} period`}</span>{' '}{period}
    </button>
    <Menu id={id} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`${spoken[kind]} period by`}>
      {Object.values(Period).map(option =>
        <Entry key={option}>
          <Item className="sub-title"
            popoverTarget={id} popoverTargetAction="hide"
            aria-current={option === period ? 'true' : undefined}
            onClick={() => choosePeriod(kind, option)}>{option}</Item>
        </Entry>
      )}
    </Menu>
  </>;
};
