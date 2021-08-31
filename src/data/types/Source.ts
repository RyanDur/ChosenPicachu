export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJK = 'rijksstudio',
}

export const toSource = (value: string): Source => {
    if (value === Source.AIC) return Source.AIC;
    if (value === Source.HARVARD) return Source.HARVARD;
    else return Source.RIJK;
};
