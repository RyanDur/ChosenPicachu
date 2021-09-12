import React, {ChangeEvent, FC} from 'react';
import {join} from '../../../util';
import {Consumer} from '@ryandur/sand';
import './FancySelect.css';
import {FormControl, InputLabel, Select} from '@material-ui/core';

interface FancySelectProps {
    selectId: string;
    optionValues: Set<string>;
    onChange: Consumer<ChangeEvent<{ name?: string; value: unknown }>>;
    value?: string;
    id?: string;
    className?: string;
    selectClassName?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}

export const FancySelect: FC<FancySelectProps> = (
    {
        id,
        children,
        value = '',
        optionValues,
        className,
        selectClassName,
        onChange,
        selectId,
        required,
        disabled,
        readOnly
    }
) => <FormControl className={className} variant={readOnly ? 'standard' : 'outlined'}>
    <InputLabel htmlFor={selectId}>State</InputLabel>
    <Select className={join('fancy-select-box fancy-text', selectClassName)}
            {...(value ? {value} : {defaultValue: ''})}
            native
            readOnly={readOnly}
            required={required}
            disabled={disabled || readOnly}
            inputProps={{
                name: 'state',
                id: selectId,
            }}
            label="State"
            data-testid={selectId}
            onChange={onChange}>
        {[<option key="placeholder" value="" disabled hidden/>,
            ...Array.from(optionValues).map(state => <option key={state}>{state}</option>)
        ]}
    </Select>
</FormControl>;