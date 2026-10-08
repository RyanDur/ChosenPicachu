import {classNames} from '@components/class-names';
import {FC, ChangeEvent} from 'react';
import {Consumer} from '@ryandur/sand';

type FancyTextareaProps = {
  onChange: Consumer<ChangeEvent<HTMLTextAreaElement>>;
  value?: string;
  readOnly?: boolean;
};

export const FancyTextarea: FC<FancyTextareaProps> = (
  {
    onChange,
    value = '',
    readOnly
  }) =>
  <label id="details-cell" className={classNames(
    'details-cell',
    'fancy',
    'soft-cornered'
  )}>
    <span id="details-label" className="fancy-title bold card-banded">Details</span>
    <textarea name="details" className="fancy-text writable rounded-corners lifted raisable" id="details"
      placeholder=" "
      value={value}
      readOnly={readOnly}
      onChange={onChange}/>
  </label>;
