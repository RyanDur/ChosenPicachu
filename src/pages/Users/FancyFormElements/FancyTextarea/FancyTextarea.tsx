import {classNames} from '@components/class-names';
import {FC, ChangeEvent} from 'react';
import {Consumer} from '@ryandur/sand';
import '../Fancy.css';

type FancyTextareaProps = {
  onChange: Consumer<ChangeEvent<HTMLTextAreaElement>>;
  value?: string;
  readOnly?: boolean;
  className?: string;
};

export const FancyTextarea: FC<FancyTextareaProps> = (
  {
    onChange,
    value = '',
    readOnly,
    className
  }) =>
  <label className={classNames(
    'fancy',
    'soft-cornered',
    className
  )}>
    <span className="fancy-title bold card-banded">Details</span>
    <textarea name="details" className="fancy-text writable rounded-corners lifted raisable" id="details"
      placeholder=" "
      value={value}
      readOnly={readOnly}
      onChange={onChange}/>
  </label>;
