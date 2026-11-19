const showTheAddress = (sheet: HTMLElement): void =>
  sheet.querySelectorAll('input').forEach(field => field.value = field.defaultValue);

export const sheetFields = {showTheAddress};
