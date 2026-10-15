export type Door = 'Structure' | 'Presentation' | 'Dynamic Interaction';

export const doorId = (door: Door): string => door.toLowerCase().split(' ').join('-');
