import names from '@navigation/names.json';
import type {Listing} from '@page';
import {spelled} from './moments';

const ofRecord = (count: number): Listing => ({
  title: names.record.title,
  description: names.record.descriptionTemplate.replace('{moments}', spelled.out(count).orElse(String(count)))
});

export const listing = {ofRecord};
