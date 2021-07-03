import React, {FC, FormEvent, useState} from 'react';
import {joinClassNames} from '../../util';
import './FancySelect.css';

interface FancySelectProps {
    selectId: string;
    optionValues: Set<string>;
    onChange: (event: FormEvent<HTMLSelectElement>) => void;
    value?: string;
    id?: string;
    className?: string;
    selectClassName?: string;
    required?: boolean;
    disabled?: boolean;
}

export const FancySelect: FC<FancySelectProps> = (
    {
        id,
        children,
        value,
        optionValues,
        className,
        selectClassName,
        onChange,
        selectId,
        required,
        disabled
    }
) => {
    const [data, updateData] = useState(value);
    const [focused, updateFocus] = useState(false);

    return <article id={id} className={joinClassNames(
        'fancy fancy-select',
        (value || data) && 'not-empty',
        disabled && 'disabled',
        focused && 'focus',
        className
    )}>
        <label className={joinClassNames('fancy-title', selectClassName)} htmlFor={selectId}>{children}</label>
        <select id={selectId}
                className={joinClassNames('fancy-select-box fancy-text', selectClassName)}
                {...(value ? {value} : {defaultValue: ''})}
                required={required}
                disabled={disabled}
                data-testid={selectId}
                onFocus={() => updateFocus(true)}
                onBlur={() => updateFocus(false)}
                onChange={event => {
                    updateData(event.target.value);
                    onChange?.(event);
                }}>
            {[<option key="placeholder" value="" disabled hidden/>,
                ...Array.from(optionValues).map(value => <option key={value}>{value}</option>)
            ]}
        </select>
    </article>;
};