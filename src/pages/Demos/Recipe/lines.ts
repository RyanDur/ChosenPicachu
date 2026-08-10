import {Line} from './Snippet';

export const plain = (text: string): Line => ({text});
export const aside = (text: string): Line => ({text, dim: true});
