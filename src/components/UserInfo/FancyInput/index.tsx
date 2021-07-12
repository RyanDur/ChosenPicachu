import React, {FC, FormEvent} from 'react';
import {join, toISOWithoutTime} from '../../util';

interface FancyTextInputProps {
    inputId: string;
    type?: string;
    id?: string;
    required?: boolean;
    onChange?: (event: FormEvent<HTMLInputElement>) => void;
    className?: string;
    inputClass?: string;
    labelId?: string;
    labelClass?: string;
    value?: string | Date;
    readOnly?: boolean;
    disabled?: boolean;
    pattern?: string;
}

export const FancyInput: FC<FancyTextInputProps> = (
    {
        inputId,
        type = 'text',
        children,
        id,
        onChange,
        className,
        inputClass,
        labelId,
        labelClass,
        required = false,
        readOnly = false,
        disabled = false,
        pattern,
        value = ''
    }
) => <article id={id} className={join(
    'fancy',
    value && 'not-empty',
    className
)}>
    <input id={inputId}
           className={join('fancy-text', inputClass)}
           pattern={pattern}
           readOnly={readOnly}
           disabled={disabled}
           required={required}
           data-testid={inputId}
           value={value instanceof Date ? toISOWithoutTime(value) : value}
           type={type}
           onChange={onChange}/>
    <label id={labelId} className={join('fancy-title', labelClass)} htmlFor={inputId}>{children}</label>
</article>;
