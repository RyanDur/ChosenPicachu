export const sheetShowsTheAddress = (sheet: HTMLElement): void =>
  sheet.querySelectorAll('input').forEach(field => field.value = field.defaultValue);
