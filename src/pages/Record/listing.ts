import names from '@navigation/names.json';
import type {Listing} from '@page';
import {spelledOut} from './moments/spelled-out';

export const recordListing = (count: number): Listing => ({
  title: names.record.title,
  description: names.record.descriptionTemplate.replace('{moments}', spelledOut(count))
});
