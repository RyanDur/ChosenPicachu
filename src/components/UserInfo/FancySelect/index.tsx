import React, {FC, FormEvent} from 'react';
import {joinClassNames} from '../../util';
import {Consumer} from '../types';
import './FancySelect.css';

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
}

/*
* using the key to force a rerender of component to make sure the default value is set on reset or when the value is ''
* feels a bit hacky but is a workaround for now. Need to reevaluate later if performance becomes a concern
* https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
* */
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
        disabled
    }
) => <article id={id} className={joinClassNames('fancy fancy-select', value && 'not-empty', className)}>
    <select id={selectId}
            className={joinClassNames('fancy-select-box fancy-text', selectClassName)}
            {...(value ? {value} : {defaultValue: ''})}
            key={value}
            required={required}
            disabled={disabled}
            data-testid={selectId}
            onChange={onChange}>
        {[<option key="placeholder" value="" disabled hidden/>,
            ...Array.from(optionValues).map(state => <option key={state}>{state}</option>)
        ]}
    </select>
    <label className={joinClassNames('fancy-title', selectClassName)} htmlFor={selectId}>{children}</label>
</article>;