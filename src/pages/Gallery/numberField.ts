// react-dom leaves the default of a focused number field as it was, and Enter keeps the reader in the field,
// so the field takes what it sent
export const numberField = {
  showsWhatItSent: (field: HTMLInputElement, sent: number): void => {
    field.defaultValue = field.value = String(sent);
  }
};
