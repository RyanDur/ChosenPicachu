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
    'fancy-textarea',
    'details-cell',
    'fancy',
    value && 'not-empty'
  )}>
    <span id="details-label" className="fancy-title bold">Details</span>
    <textarea name="details" className="fancy-text lifted raisable" id="details"
      value={value}
      readOnly={readOnly}
      onChange={onChange}/>
  </label>;
