export const typedValues = {
  droppedIn: (holder: ParentNode): void =>
    holder.querySelectorAll('input').forEach(field => field.value = field.defaultValue)
};
