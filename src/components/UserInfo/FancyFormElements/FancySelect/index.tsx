import {FC, FormEvent, PropsWithChildren} from 'react';
import {join} from '../../../util';
import {FancyInput} from '../FancyInput';
import {Consumer} from '@ryandur/sand';
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
    readOnly?: boolean;
}

export const FancySelect: FC<PropsWithChildren<FancySelectProps>> = (
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
) => (readOnly || disabled) ? <FancyInput className={className} id={id} value={value} readOnly={readOnly} disabled={disabled} inputId={selectId}>{children}</FancyInput> :
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
