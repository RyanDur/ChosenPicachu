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
    optionClassName?: string;
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
        optionClassName,
        onChange,
        selectId,
        required,
        disabled
    }
) => {
    const [data, updateData] = useState(value);
    return <article id={id} className={joinClassNames('fancy-select', (value || data) && 'not-empty', className)}>
        <select id={selectId}
                className={joinClassNames('fancy-select-box', 'minimal', selectClassName)}
                required={required}
                {...(value ? {value} : {defaultValue: ''})}
                disabled={disabled}
                data-testid={selectId}
                onChange={event => {
                    updateData(event.target.value);
                    onChange?.(event);
                }}>
            {[<option key="placeholder" className={joinClassNames('fancy-option', optionClassName)}
                      value="" disabled hidden/>,
                ...Array.from(optionValues).map((value) =>
                    <option className={joinClassNames('fancy-option', optionClassName)} key={value}>
                        {value}
                    </option>)
            ]}
        </select>
        <label className={joinClassNames('fancy-select-title', selectClassName)} htmlFor={selectId}>{children}</label>
    </article>;
};