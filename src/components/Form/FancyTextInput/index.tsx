import React, {FC, FormEvent, useState} from 'react';
import './FancyTextInput.css';
import {joinClassNames} from '../../util';

interface FancyTextInputProps {
    inputId: string;
    id?: string;
    required?: boolean;
    onChange?: (event: FormEvent<HTMLInputElement>) => void;
    articleClass?: string;
    inputClass?: string;
    labelId?: string;
    labelClass?: string;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export const FancyTextInput: FC<FancyTextInputProps> = (
    {
        inputId,
        children,
        id,
        required = false,
        onChange,
        articleClass,
        inputClass,
        labelId,
        labelClass,
        value,
        readOnly,
        disabled
    }
) => {
    const [data, updateData] = useState(value);
    return <article id={id} className={joinClassNames('fancy-input', (value || data) && 'not-empty', articleClass)}>
        <input id={inputId} className={joinClassNames('fancy-text', inputClass)}
               value={value} readOnly={readOnly} disabled={disabled} required={required} data-testid={inputId}
               onChange={event => {
                   updateData(event.currentTarget.value);
                   onChange?.(event);
               }}/>
        <label id={labelId} className={joinClassNames('fancy-title', labelClass)} htmlFor={inputId}>{children}</label>
    </article>;
};
