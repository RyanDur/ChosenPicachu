import {PartsGroup} from '../../parts-listed';
import {tableParts} from '../part-pages';
import {tableTutorials} from '../tutorial-pages';

export const tablesListed: readonly PartsGroup[] = [
  {
    label: 'Build the live table',
    entries: tableParts.inOrder.map(part => ({to: tableParts.addressOf(part), ...tableParts.told(part)}))
  },
  {
    label: 'Add what the trader asked for',
    entries: tableTutorials.all().map(tutorial => ({
      to: tableTutorials.addressOf(tutorial),
      name: tableTutorials.nameOf(tutorial),
      minutes: tableTutorials.minutesOf(tutorial),
      says: tableTutorials.saysOf(tutorial)
    }))
  }
];
