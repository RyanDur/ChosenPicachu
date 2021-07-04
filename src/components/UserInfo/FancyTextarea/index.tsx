import {joinClassNames} from '../../util';
import React, {FC, FormEvent, useState} from 'react';
import {Consumer} from '../types';

interface FancyTextareaProps {
    onChange: Consumer<FormEvent<HTMLTextAreaElement>>;
    value?: string;
}

export const FancyTextarea: FC<FancyTextareaProps> = ({onChange, value = ''}) => {
    const [focused, updateDetailsFocus] = useState(false);

    return <article id="details-cell" className={joinClassNames(
        'fancy',
        focused && 'focus',
        value && 'not-empty'
    )}>
        <label id="details-label" className="fancy-title" htmlFor="details">Details</label>
        <textarea name="details" className="fancy-text" id="details"
                  onFocus={() => updateDetailsFocus(true)}
                  onBlur={() => updateDetailsFocus(false)}
                  value={value}
                  onChange={onChange}/>
    </article>;
};