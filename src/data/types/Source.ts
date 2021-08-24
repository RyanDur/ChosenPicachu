export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
}

export const toSource = (value: string): Source => {
    if (value === Source.AIC.valueOf()) return Source.AIC;
    else return Source.HARVARD;
};
