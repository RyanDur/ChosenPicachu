import React, {ChangeEvent, FC} from 'react';
import {Consumer} from '@ryandur/sand';
import {FormControl, Input, InputLabel} from '@material-ui/core';

interface FancyTextareaProps {
    onChange: Consumer<ChangeEvent<{ value: unknown }>>;
    value?: string;
    readOnly?: boolean
}

export const FancyTextarea: FC<FancyTextareaProps> = (
    {
        onChange,
        value = '',
        readOnly
    }) => {
    return <FormControl id="details-cell" variant={readOnly ? 'standard' : 'outlined'}>
        <InputLabel id="details-label" htmlFor="details">Details</InputLabel>
        <Input id="details"
               inputComponent="input"
               multiline={true}
               minRows={4}
               readOnly={readOnly}
               value={value}
               onChange={onChange}/>
    </FormControl>;
};