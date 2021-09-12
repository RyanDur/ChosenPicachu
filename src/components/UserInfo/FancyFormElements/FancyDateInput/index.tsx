import React, {FC} from 'react';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';

interface FancyDateInputProps {
    inputId: string;
    id?: string;
    required?: boolean;
    onChange: (date: MaterialUiPickersDate) => void;
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

export const FancyDateInput: FC<FancyDateInputProps> = ({id, inputId, disabled, readOnly, value, onChange}) => {
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <article id={id}>
            <DatePicker
                inputVariant={readOnly ? 'standard' : 'outlined'}
                id={inputId}
                placeholder="mm/dd/yyyy"
                label="Date of Birth"
                onChange={onChange}
                disabled={disabled}
                readOnly={readOnly}
                value={value || null}/>
        </article>
    </MuiPickersUtilsProvider>;
};

