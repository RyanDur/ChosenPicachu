import {Entry, Item, Menu} from '@components/Menu';
import {FC} from 'react';
import {Period} from '../Market';

type Props = {
  id: string;
  chart: 'price' | 'candle';
  period: Period;
  onPeriodChosen: (period: Period) => void;
};

export const PeriodMenu: FC<Props> = ({id, chart, period, onPeriodChosen}) => <>
  <button type="button" className="period-toggle rounded-corners field borderless attentive focus-ringed caption reachable"
    popoverTarget={id}>
    <span className="off-screen">{`${chart} period`}</span>{' '}{period}
  </button>
  <Menu id={id} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`${chart} period by`}>
    {Object.values(Period).map(option =>
      <Entry key={option}>
        <Item className="sub-title"
          popoverTarget={id} popoverTargetAction="hide"
          aria-current={option === period ? 'true' : undefined}
          onClick={() => onPeriodChosen(option)}>{option}</Item>
      </Entry>
    )}
  </Menu>
</>;
