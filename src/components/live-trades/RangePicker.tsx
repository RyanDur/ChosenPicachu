import {FC, FormEvent} from 'react';
import {FancyDateInput} from '@components/FancyFormElements/FancyDateInput';
import {DateRange} from './period';

type Props = {
  idPrefix: string;
  value: DateRange | null;
  onPick: (range: DateRange) => void;
};

export const RangePicker: FC<Props> = ({idPrefix, value, onPick}) => {
  const from = value?.from ?? '';
  const to = value?.to ?? '';
  const pickFrom = (event: FormEvent<HTMLInputElement>): void =>
    onPick({from: event.currentTarget.value, to: to === '' ? event.currentTarget.value : to});
  const pickTo = (event: FormEvent<HTMLInputElement>): void =>
    onPick({from: from === '' ? event.currentTarget.value : from, to: event.currentTarget.value});
  return <fieldset className="range-picker">
    <FancyDateInput inputId={`${idPrefix}-from`} value={from} onChange={pickFrom}>from</FancyDateInput>
    <FancyDateInput inputId={`${idPrefix}-to`} value={to} onChange={pickTo}>to</FancyDateInput>
  </fieldset>;
};
