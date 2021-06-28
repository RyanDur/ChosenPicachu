import React, {FC, FormEvent} from 'react';

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
        value = '',
        optionValues,
        className,
        selectClassName,
        onChange,
        selectId,
        required,
        disabled
    }
) => <article id={id} className={className}>
    <label htmlFor={selectId}>{children}</label>
    <select id={selectId}
            className={selectClassName}
            required={required}
            value={value}
            disabled={disabled}
            data-testid={selectId}
            onChange={onChange}>
        {[<option key="placeholder" value="" disabled hidden/>,
            ...Array.from(optionValues).map((value) =>
                <option key={value}>{value}</option>)
        ]}
    </select>
</article>;