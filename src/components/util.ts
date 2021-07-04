export const joinClassNames =
    (...classes: Partial<(string | boolean)[]>) => classes.filter(className => className).join(' ').trim();


type Indexable = {
    [index in (string | number)]: unknown;
};

export const notEmpty = <T>(obj?: T, ...optional: (string | number)[]): boolean => {
    if (typeof obj === 'object') {
        const indexable = obj as Indexable;
        return !!Object.keys(indexable)
            .filter(key => !optional.includes(key))
            .map(key => indexable[key])
            .filter(value => !!value)
            .length;
    } return false;
};