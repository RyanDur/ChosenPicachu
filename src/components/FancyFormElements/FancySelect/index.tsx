import React, {ChangeEvent, FC} from 'react';
import {join} from '../../util';
import {Consumer} from '@ryandur/sand';
import './FancySelect.css';
import {FormControl, InputLabel, Select} from '@material-ui/core';
import {FancyInput} from '../FancyInput';

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
) => (readOnly || disabled) ?
    <FancyInput id={id} value={value} required={required} readOnly={readOnly} disabled={disabled}>State</FancyInput> :
    <FormControl className={className} variant='standard'>
        <InputLabel htmlFor={selectId}>State</InputLabel>
        <Select className={join('fancy-select-box fancy-text', selectClassName)}
                {...(value ? {value} : {defaultValue: ''})}
                native
                required={required}
                inputProps={{
                    name: 'state',
                    id: selectId,
                }}
                label="State"
                value={value}
                data-testid={selectId}
                onChange={onChange}>
            {[<option key="placeholder" value="" disabled hidden/>,
                ...Array.from(optionValues).map(state => <option key={state}>{state}</option>)
            ]}
        </Select>
    </FormControl>;