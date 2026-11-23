import {PartsGroup} from '../parts-listed';
import {zIndexParts} from './part-pages';

export const zIndexListed: readonly PartsGroup[] = [
  {entries: zIndexParts.inOrder.map(part => ({to: zIndexParts.addressOf(part), ...zIndexParts.told(part)}))}
];
