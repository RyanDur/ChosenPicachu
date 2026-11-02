import names from '../names.json';
import type {Listing} from '../BasePage/Header';
import {spelledOut} from './moments/spelled-out';

export const recordListing = (count: number): Listing => ({
  title: names.record.title,
  description: names.record.descriptionTemplate.replace('{moments}', spelledOut(count))
});
