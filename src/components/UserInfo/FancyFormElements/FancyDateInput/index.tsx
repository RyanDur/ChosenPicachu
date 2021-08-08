import React, {FC, FormEvent} from 'react';
import {FancyInput} from '../FancyInput';

interface FancyDateInputProps {
    inputId: string;
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
    autoFocus?: boolean;
    pattern?: string;
}

export const FancyDateInput: FC<FancyDateInputProps> = ({readOnly, ...rest}) => {
    return readOnly ? <FancyInput type="text" readOnly={readOnly} {...rest}/> : <FancyInput type="date" {...rest}/>;
};