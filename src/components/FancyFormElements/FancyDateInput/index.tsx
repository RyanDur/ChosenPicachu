import React, {ChangeEvent, FC} from 'react';
import {FancyInput} from '../FancyInput';
import {withStyles} from '@material-ui/core';
import {join} from '../../util';

interface FancyDateInputProps {
    inputId: string;
    id?: string;
    required?: boolean;
    onChange: (event: ChangeEvent<{ value: unknown }>) => void;
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

export const FancyDateInput: FC<FancyDateInputProps> = ({
    id,
    className,
    required,
    disabled,
    readOnly,
    value,
    onChange
}) => {
    const Foo = withStyles(() => ({
        root: {
            '& .MuiInput-root': {
                color: 'red'
            }
        }
    }))(FancyInput);
    return <Foo type="date"
                id={id}
                className={join(className)}
                value={value}
                onChange={onChange}
                required={required}
                readOnly={readOnly}
                disabled={disabled}>Date of Birth</Foo>;
    // <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //     <article id={id}>
    //         <DatePicker
    //             inputVariant={readOnly ? 'standard' : 'outlined'}
    //             id={inputId}
    //             required={true}
    //             placeholder="mm/dd/yyyy"
    //             label="Date of Birth"
    //             onChange={onChange}
    //             disabled={disabled}
    //             readOnly={readOnly}
    //             value={value || null}/>
    //     </article>
    // </MuiPickersUtilsProvider>;
};

