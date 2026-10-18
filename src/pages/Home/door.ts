import {Door} from '@pages/Record/moments/moments';

export const doorId = (door: Door): string => door.toLowerCase().split(' ').join('-');
