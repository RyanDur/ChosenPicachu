import {join} from '../../../util';
import {FC, FormEvent, useState} from 'react';
import {Consumer} from '@ryandur/sand';

interface FancyTextareaProps {
    onChange: Consumer<FormEvent<HTMLTextAreaElement>>;
    value?: string;
    readOnly?: boolean
}

export const FancyTextarea: FC<FancyTextareaProps> = (
    {
        onChange,
        value = '',
        readOnly
    }) => {
    const [focused, updateDetailsFocus] = useState(false);

    return <article id="details-cell" className={join(
        'fancy',
        focused && 'focus',
        value && 'not-empty',
        readOnly && 'read-only'
    )}>
        <label id="details-label" className="fancy-title" htmlFor="details">Details</label>
        <textarea name="details" className="fancy-text" id="details"
                  onFocus={() => updateDetailsFocus(true)}
                  onBlur={() => updateDetailsFocus(false)}
                  value={value}
                  readOnly={readOnly}
                  onChange={onChange}/>
    </article>;
};
