import React, {FC, FormEvent} from 'react';
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
        onChange,
        articleClass,
        inputClass,
        labelId,
        labelClass,
        required = false,
        readOnly = false,
        disabled = false,
        pattern,
        value = ''
    }
) => <article id={id} className={joinClassNames(
    'fancy-select fancy',
    value && 'not-empty',
    articleClass
)}>
    <input id={inputId}
           className={joinClassNames('fancy-text', inputClass)}
           pattern={pattern}
           readOnly={readOnly}
           disabled={disabled}
           required={required}
           data-testid={inputId}
           value={value}
           onChange={onChange}/>
    <label id={labelId} className={joinClassNames('fancy-title', labelClass)} htmlFor={inputId}>{children}</label>
</article>;
