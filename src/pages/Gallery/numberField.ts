// react-dom leaves the default of a focused number field as it was, and Enter and a refusal keep the reader in the
// field, so the field takes the number it shows itself
export const numberField = {
  shows: (field: HTMLInputElement, shown: number): void => {
    field.defaultValue = field.value = String(shown);
  }
};
