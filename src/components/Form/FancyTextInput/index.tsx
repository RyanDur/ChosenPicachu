import React, {FC, FormEvent, useState} from 'react';
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
    pattern?: string;
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
        disabled,
        pattern
    }
) => {
    const [data, updateData] = useState(value);
    const [focused, updateFocus] = useState(false);

    return <article id={id} className={joinClassNames(
        'fancy-select fancy',
        (value || data) && 'not-empty',
        disabled && 'disabled',
        readOnly && 'read-only',
        focused && 'focus',
        articleClass
    )}>
        <label id={labelId} className={joinClassNames('fancy-title', labelClass)} htmlFor={inputId}>{children}</label>
        <input id={inputId} className={joinClassNames('fancy-text', inputClass)}
               onFocus={() => updateFocus(true)}
               onBlur={() => updateFocus(false)}
               pattern={pattern}
               value={value}
               readOnly={readOnly}
               disabled={disabled}
               required={required}
               data-testid={inputId}
               onChange={event => {
                   updateData(event.currentTarget.value);
                   onChange?.(event);
               }}/>
    </article>;
};
