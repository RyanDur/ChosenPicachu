import React, {ChangeEvent, FC} from 'react';
import {Consumer} from '@ryandur/sand';
import {TextField} from '@material-ui/core';
import {FancyInput} from '../FancyInput';

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
    }) => <FancyInput className="details"
                      multiline={true}
                      minRows={4}
                      value={value}
                      disabled={readOnly}
                      onChange={onChange}>Details</FancyInput>;