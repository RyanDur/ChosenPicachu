import React, {FC, FormEvent} from 'react';
import {join} from '../../../util';
import {Consumer} from '../../types';
import './FancySelect.css';
import {FancyInput} from '../FancyInput';

interface FancySelectProps {
    selectId: string;
    optionValues: Set<string>;
    onChange: Consumer<FormEvent<HTMLSelectElement>>;
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
) => readOnly ? <FancyInput className={className} id={id} value={value} readOnly={readOnly} inputId={selectId}>{children}</FancyInput> :
    <article id={id} className={join('fancy fancy-select', value && 'not-empty', className)}>
        <select id={selectId}
                className={join('fancy-select-box fancy-text', selectClassName)}
                {...(value ? {value} : {defaultValue: ''})}
                required={required}
                disabled={disabled || readOnly}
                data-testid={selectId}
                onChange={onChange}>
            {[<option key="placeholder" value="" disabled hidden/>,
                ...Array.from(optionValues).map(state => <option key={state}>{state}</option>)
            ]}
        </select>
        <label className={join('fancy-title', selectClassName)} htmlFor={selectId}>{children}</label>
    </article>;