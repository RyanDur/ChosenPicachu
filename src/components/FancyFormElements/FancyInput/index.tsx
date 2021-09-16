import React, {ChangeEvent, FC} from 'react';
import {TextField, withStyles} from '@material-ui/core';
import {join, toISOWithoutTime} from '../../util';

interface FancyTextInputProps {
    type?: string;
    id?: string;
    required?: boolean;
    onChange?: (event: ChangeEvent<{ value: unknown }>) => void;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    minRows?: number;
    value?: string | Date;
    readOnly?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    pattern?: string;
}

export const FancyInput: FC<FancyTextInputProps> = (
    {
        type = 'text',
        children,
        id,
        onChange,
        placeholder,
        className,
        required = false,
        readOnly = false,
        disabled = false,
        autoFocus = false,
        pattern,
        multiline = false,
        minRows,
        value = ''
    }
) => {
    const NoBorderTextField = withStyles(() => ({
        root: {
            '& .Mui-disabled': {
                color: 'var(--void)'
            },
            '& .Mui-disabled:before ':{
                border: 'none'
            },
            '& .Mui-disabled:after ':{
                border: 'none'
            }
        }
    }))(TextField);
    return <NoBorderTextField id={id}
                              autoFocus={autoFocus}
                              type={type}
                              placeholder={placeholder}
                              required={required}
                              className={join(className, 'foo')}
                              multiline={multiline}
                              minRows={minRows}
                              label={children}
                              value={value instanceof Date ? toISOWithoutTime(value) : value}
                              name={id}
                              disabled={readOnly || disabled}
                              inputProps={{
                                  disabled,
                                  readOnly,
                                  pattern
                              }}
                              onChange={onChange}
                              variant='standard'/>;
};