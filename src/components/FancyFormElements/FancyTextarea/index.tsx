import {classNames} from '@components/class-names';
import {FC, FormEvent} from 'react';
import {Consumer} from '@ryandur/sand';
import '../fancy.css';

type FancyTextareaProps = {
    onChange: Consumer<FormEvent<HTMLTextAreaElement>>;
    value?: string;
    readOnly?: boolean
}

export const FancyTextarea: FC<FancyTextareaProps> = (
    {
        onChange,
        value = '',
        readOnly
    }) =>
    <article id="details-cell" className={classNames(
        'fancy-textarea',
        'fancy',
        value && 'not-empty'
    )}>
        <label id="details-label" className="fancy-title bold" htmlFor="details">Details</label>
        <textarea name="details" className="fancy-text" id="details"
                  value={value}
                  readOnly={readOnly}
                  onChange={onChange}/>
    </article>;

