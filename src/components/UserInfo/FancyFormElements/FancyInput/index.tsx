import React, {ChangeEvent, FC} from 'react';
import {join, toISOWithoutTime} from '../../../util';
import {FormControl, Input, InputLabel} from '@material-ui/core';

interface FancyTextInputProps {
    inputId: string;
    type?: string;
    id?: string;
    required?: boolean;
    onChange?: (event: ChangeEvent<{ value: unknown }>) => void;
    className?: string;
    inputClass?: string;
    labelId?: string;
    labelClass?: string;
    value?: string | Date;
    readOnly?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
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
        autoFocus = false,
        pattern,
        value = ''
    }
) => <FormControl id={id} className={className} variant={readOnly ? 'standard' : 'outlined'}>
    <InputLabel id={labelId} className={join(labelClass)} htmlFor={inputId}>{children}</InputLabel>
    <Input id={inputId}
           inputComponent="input"
           className={inputClass}
           readOnly={readOnly}
           disabled={disabled}
           required={required}
           data-testid={inputId}
           autoFocus={autoFocus}
           inputProps={{
               pattern
           }}
           value={value instanceof Date ? toISOWithoutTime(value) : value}
           type={type}
           onChange={onChange}
    />
</FormControl>;
