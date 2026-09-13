import {FC, ChangeEvent, PropsWithChildren} from 'react';
import {FancyInput} from '../FancyInput';

type FancyDateInputProps = {
    inputId: string;
    id?: string;
    required?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputClass?: string;
    labelId?: string;
    labelClass?: string;
    value?: string | Date;
    readOnly?: boolean;
    disabled?: boolean;
    pattern?: string;
}

export const FancyDateInput: FC<PropsWithChildren<FancyDateInputProps>> = ({readOnly, ...rest}) => readOnly ?
    <FancyInput type="text" readOnly={readOnly} {...rest}/> : <FancyInput type="date" {...rest}/>;
